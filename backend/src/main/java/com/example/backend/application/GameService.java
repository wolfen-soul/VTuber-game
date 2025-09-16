package com.example.backend.application;

import com.example.backend.domain.*;
import com.example.backend.dto.game.FactorySessionView;
import com.example.backend.dto.game.FactoryStatistics;
import com.example.backend.dto.game.StreamSessionView;
import com.example.backend.dto.game.StreamStatistics;
import com.example.backend.repo.FactorySessionRepo;
import com.example.backend.repo.StreamSessionRepo;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class GameService {
    private final BanService banService;
    private final FactorySessionRepo factorySessionRepo;
    private final StreamSessionRepo streamSessionRepo;
    private final UserService userService;

    private final Map<String, FactorySession> activeFactorySessions = new ConcurrentHashMap<>();
    private final Map<String, StreamSession> activeStreamSessions = new ConcurrentHashMap<>();

    private static final Set<String> MANDATORY_CATEGORIES = Set.of(
            "pc-cases", "pc-cpus", "pc-gpus", "pc-motherboards", "pc-ram", "pc-storage",
            "pc-cooling", "models-items", "hardware-keyboards", "hardware-mice",
            "hardware-headphones", "hardware-monitors", "hardware-mats", "games-items"
    );

    public GameService(BanService banService, FactorySessionRepo factorySessionRepo,
                       StreamSessionRepo streamSessionRepo, UserService userService) {
        this.banService = banService;
        this.factorySessionRepo = factorySessionRepo;
        this.streamSessionRepo = streamSessionRepo;
        this.userService = userService;
    }


    public FactorySessionView registerFactoryClick(String username) {
        FactorySession session = activeFactorySessions.get(username);
        if (session == null) {
            throw new IllegalStateException("No active factory session");
        }

        session.click();
        return session;
    }

    public StreamSessionView registerStreamClick(String username, boolean clickStatus) {
        StreamSession session = activeStreamSessions.get(username);
        if (session == null) {
            throw new IllegalStateException("No active stream session");
        }

        GameStateEntity gameState = userService.getGameState(username);
        List<Double> multipliers = calculateMultipliers(gameState);
        session.click(clickStatus, multipliers);
        return session;
    }


    @Transactional
    public FactorySessionView startFactory(String username) {
        if (activeFactorySessions.containsKey(username)) {
            return activeFactorySessions.get(username);
        }

        String category = "factory";
        if (banService.checkBan(username, category)) {
            throw new IllegalStateException("You are banned until " +
                    banService.getFormattedTime(username, category));
        }

        Optional<FactorySessionEntity> savedSession = factorySessionRepo.findByUsername(username);
        if (savedSession.isPresent()) {
            FactorySession session = FactorySession.fromEntity(savedSession.get());
            activeFactorySessions.put(username, session);
            factorySessionRepo.deleteByUsername(username);
            return session;
        }

        FactorySession session = new FactorySession();
        activeFactorySessions.put(username, session);
        return session;
    }

    @Transactional
    public void saveFactory(String username) {
        FactorySession session = activeFactorySessions.get(username);
        if (session != null) {
            GameStateEntity gameState = userService.getGameState(username);
            processFactoryResults(gameState, session.toStatistics());
            FactorySessionEntity entity = session.toEntity(username);
            factorySessionRepo.save(entity);
            activeFactorySessions.remove(username);
        }
    }

    @Transactional
    public void finishFactory(String username) {
        FactorySession session = activeFactorySessions.remove(username);
        if (session != null) {
            GameStateEntity gameState = userService.getGameState(username);
            FactoryStatistics stats = session.toStatistics();
            processFactoryResults(gameState, stats);
            banService.banUser(username, "factory", 5);
            factorySessionRepo.deleteByUsername(username);
        }
    }

    @Transactional
    public StreamSessionView startStream(String username, int level) {
        if (activeStreamSessions.containsKey(username)) {
            return activeStreamSessions.get(username);
        }

        GameStateEntity gameState = userService.getGameState(username);

        if (!hasMinimumEquipment(gameState)) {
            throw new IllegalStateException(
                    "Cannot start stream. Not all required items purchased. You need at least tier 1 items in all categories except vtuber-equipment.");
        }

        String category = "stream";
        if (banService.checkBan(username, category)) {
            throw new IllegalStateException("You are banned until " +
                    banService.getFormattedTime(username, category));
        }

        Optional<StreamSessionEntity> savedSession = streamSessionRepo.findByUsername(username);
        if (savedSession.isPresent()) {
            StreamSession session = StreamSession.fromEntity(savedSession.get());
            activeStreamSessions.put(username, session);
            streamSessionRepo.deleteByUsername(username);
            return session;
        }

        StreamSession session = new StreamSession();
        session.initTime();
        session.setLevel(level);
        activeStreamSessions.put(username, session);
        gameState.activateStream();
        return session;
    }

    @Transactional
    public void saveStream(String username, long remainingTimeMs) {
        StreamSession session = activeStreamSessions.get(username);
        if (session != null) {
            session.setRemainingTimeMs(remainingTimeMs);
            StreamSessionEntity entity = session.toEntity(username);
            streamSessionRepo.save(entity);
            activeStreamSessions.remove(username);
        }
    }

    @Transactional
    public StreamStatistics finishStream(String username) {
        StreamSession session = activeStreamSessions.remove(username);
        if (session != null) {
            GameStateEntity gameState = userService.getGameState(username);
            StreamStatistics stats = session.toStatistics();
            processStreamResults(gameState, stats);
            gameState.deactivateStream();
            banService.banUser(username, "stream", 3);
            streamSessionRepo.deleteByUsername(username);
            return stats;
        }

        return null;
    }


    private List<Double> calculateMultipliers(GameStateEntity gameState) {
        double chanceMultiplier = 1.0;
        double donationMultiplier = 1.0;
        double subscriberMultiplier = 1.0;
        double viewerMultiplier = 1.0;
        double commonMultiplier = 1.0;

        for (ItemEntity item : gameState.getOwnedItems()) {
            switch (item.getBonusCategory()) {
                case "events" -> chanceMultiplier += item.getBonus();
                case "donations" -> donationMultiplier += item.getBonus();
                case "subscribers" -> subscriberMultiplier += item.getBonus();
                case "viewers" -> viewerMultiplier += item.getBonus();
                case "common" -> {
                    donationMultiplier += item.getBonus();
                    subscriberMultiplier += item.getBonus();
                    viewerMultiplier += item.getBonus();
                }
            }
        }

        CollabEntity collab = gameState.getCollab();
        if (collab != null) {
            commonMultiplier += collab.getMultiplier();
        }

        return List.of(chanceMultiplier, donationMultiplier, subscriberMultiplier, viewerMultiplier, commonMultiplier);
    }

    private int updateOnlineHistory(GameStateEntity gameState, int newValue) {
        List<Integer> history = gameState.getOnlineHistory();
        history.add(newValue);

        while (history.size() > 10) {
            history.removeFirst();
        }

        int sum = 0;
        for (int value : history) {
            sum += value;
        }

        return sum / history.size();
    }

    private StreamStatistics processStreamAverage(GameStateEntity gameState, StreamStatistics stats) {
        int newAverage = updateOnlineHistory(gameState, stats.averageOnline());
        return new StreamStatistics(stats.correctClicks(), stats.accuracy(), stats.subscribers(),
                newAverage, stats.income(), stats.donationsAmount());
    }

    private boolean hasMinimumEquipment(GameStateEntity gameState) {
        Set<String> ownedCategories = new HashSet<>();
        for (ItemEntity item : gameState.getOwnedItems()) {
            ownedCategories.add(item.getCategory());
        }

        for (String mandatoryCategory : MANDATORY_CATEGORIES) {
            if (!ownedCategories.contains(mandatoryCategory)) {
                return false;
            }
        }
        return true;
    }

    private void processStreamResults(GameStateEntity gameState, StreamStatistics stats) {
        StreamStatistics processedStats = processStreamAverage(gameState, stats);

        gameState.addSubscribers(processedStats.subscribers());
        gameState.incrementStreamsAmount();
        gameState.addIncome(processedStats.income());
        gameState.updateDonationsAmount(processedStats.donationsAmount());
        gameState.updateAverageOnline(processedStats.averageOnline());
    }

    private void processFactoryResults(GameStateEntity gameState, FactoryStatistics stats) {
        gameState.addIncome(stats.income());
    }


    private static class FactorySession implements FactorySessionView {
        private final Random random = new Random();
        private int clicks = 0;
        private int income = 0;

        private static final int MAX_INCOME = 5;

        public int getClicks() {
            return clicks;
        }
        public int getIncome() {
            return income;
        }

        public synchronized void click() {
            clicks++;
            income += random.nextInt(MAX_INCOME + 1);
        }

        public FactoryStatistics toStatistics() {
            return new FactoryStatistics(clicks, income);
        }

        public FactorySessionEntity toEntity(String username) {
            return new FactorySessionEntity(username, clicks);
        }

        public static FactorySession fromEntity(FactorySessionEntity entity) {
            FactorySession session = new FactorySession();
            session.clicks = entity.getClicks();
            session.income = 0;
            return session;
        }
    }

    private static class StreamSession implements StreamSessionView {
        private final Random random = new Random();
        private int level = 1;
        private double accuracy = 0.0;
        private int clicks = 0;
        private int correctClicks = 0;
        private int subscribers = 0;
        private int currentOnline = 0;
        private int income = 0;
        private int donationsAmount = 0;

        private long remainingTimeMs;

        private static final double CHANCE = 0.5;
        private static final int MIN_INCOME = 50;
        private static final int MAX_INCOME = 500;
        private static final int MIN_SUBSCRIBERS = 5;
        private static final int MAX_SUBSCRIBERS = 10;
        private static final int MIN_VIEWERS = -10;
        private static final int MAX_VIEWERS = 20;
        private static final long TOTAL_GAME_TIME = 60 * 1000;


        public int getLevel() {
            return level;
        }

        public void setLevel(int level) {
            this.level = level;
        }

        public double getAccuracy() {
            return accuracy;
        }

        public int getClicks() {
            return clicks;
        }

        public int getCorrectClicks() {
            return correctClicks;
        }

        public int getSubscribers() {
            return subscribers;
        }

        public int getCurrentOnline() {
            return currentOnline;
        }

        public int getIncome() {
            return income;
        }

        public int getDonationsAmount() {
            return donationsAmount;
        }

        public long getRemainingTimeMs() {
            return remainingTimeMs;
        }

        public void setRemainingTimeMs(long remainingTimeMs) {
            this.remainingTimeMs = remainingTimeMs;
        }

        public void initTime() {
            this.remainingTimeMs = TOTAL_GAME_TIME;
        }


        public synchronized void click(boolean isGood, List<Double> multipliers) {
            clicks++;

            if (isGood) {
                correctClicks++;
                handleGoodClick(multipliers);
            }
            else {
                handleBadClick(multipliers);
            }

            accuracy = clicks > 0 ? ((double) correctClicks / clicks) * 100 : 0;
            accuracy = Math.max(0, Math.min(100, accuracy));

            currentOnline = Math.max(0, currentOnline);
            subscribers = Math.max(0, subscribers);
        }

        private void handleGoodClick(List<Double> multipliers) {
            if (random.nextDouble() < CHANCE * multipliers.getFirst()) {
                int action = random.nextInt(0, 3);
                double commonMultiplier = multipliers.getLast();
                int amount;

                if ((action == 0) && (currentOnline > 0)) {
                    donationsAmount++;
                    amount = MIN_INCOME + random.nextInt(MAX_INCOME - MIN_INCOME + 1);
                    income += (int)(amount * (multipliers.get(1) * commonMultiplier));
                }
                else if (action == 1) {
                    amount = MIN_SUBSCRIBERS + random.nextInt(MAX_SUBSCRIBERS - MIN_SUBSCRIBERS + 1);
                    subscribers += (int)(amount * (multipliers.get(2) * commonMultiplier));
                }
                else {
                    amount = MIN_VIEWERS + random.nextInt(MAX_VIEWERS - MIN_VIEWERS + 1);
                    currentOnline += (int)(amount * (multipliers.get(3) * commonMultiplier));
                }
            }
        }

        private void handleBadClick(List<Double> multipliers) {
            if (random.nextDouble() < CHANCE * multipliers.getFirst()) {
                boolean unsubscriber = random.nextBoolean();
                double commonMultiplier = multipliers.getLast();
                int amount;

                if (!unsubscriber) {
                    amount = MIN_VIEWERS + random.nextInt(MAX_VIEWERS - MIN_VIEWERS + 1);
                    currentOnline -= (int)(amount * (multipliers.get(2) + commonMultiplier) / 2);
                }
                else {
                    amount = MIN_SUBSCRIBERS + random.nextInt(MAX_SUBSCRIBERS - MIN_SUBSCRIBERS + 1);
                    subscribers -= (int)(amount * (multipliers.get(1) + commonMultiplier) / 2);
                }
            }
        }

        public StreamStatistics toStatistics() {
            return new StreamStatistics(correctClicks, accuracy, subscribers, currentOnline, income, donationsAmount);
        }

        public StreamSessionEntity toEntity(String username) {
            return new StreamSessionEntity(username, level, clicks, correctClicks, accuracy, subscribers,
                    currentOnline, income, donationsAmount, remainingTimeMs);
        }

        public static StreamSession fromEntity(StreamSessionEntity entity) {
            StreamSession session = new StreamSession();
            session.level = entity.getLevel();
            session.accuracy = entity.getAccuracy();
            session.clicks = entity.getClicks();
            session.correctClicks = entity.getCorrectClicks();
            session.subscribers = entity.getSubscribers();
            session.currentOnline = entity.getCurrentOnline();
            session.income = entity.getIncome();
            session.donationsAmount = entity.getDonationsAmount();
            session.remainingTimeMs = entity.getRemainingTimeMs();
            return session;
        }
    }
}
