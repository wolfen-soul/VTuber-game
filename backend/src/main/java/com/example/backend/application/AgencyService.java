package com.example.backend.application;

import com.example.backend.domain.*;
import com.example.backend.exception.NotFoundException;
import com.example.backend.repo.AgencyRepo;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class AgencyService {
    private final AgencyRepo agencyRepo;
    private final BanService banService;
    private final RequirementService requirementService;
    private final UserService userService;

    public AgencyService(AgencyRepo agencyRepo, BanService banService, RequirementService requirementService, UserService userService) {
        this.agencyRepo = agencyRepo;
        this.banService = banService;
        this.requirementService = requirementService;
        this.userService = userService;
    }

    public List<AgencyEntity> all() {
        return agencyRepo.findAllWithRequirements();
    }

    public AgencyEntity get(String title) {
        return agencyRepo.findByTitleWithRequirements(title)
                .orElseThrow(() -> new NotFoundException(HttpStatus.NOT_FOUND, "Agency not found"));
    }

    @Transactional
    public void add(AgencyEntity agency) {
        agencyRepo.save(agency);
    }

    @Transactional
    public void acceptAgency(String username, String agencyTitle) {
        synchronized (username.intern()) {
            GameStateEntity gameState = userService.getGameState(username);

            if (gameState.getAgency() != null) {
                throw new IllegalStateException("You already have an agency");
            }

            String category = "agency";
            if (banService.checkBan(username, category)) {
                throw new IllegalStateException("You are banned until " +
                        banService.getFormattedTime(username, category));
            }

            AgencyEntity agency = get(agencyTitle);

            if (!areAllRequirementsMet(agency, gameState)) {
                throw new IllegalStateException("Not all agency requirements are met");
            }

            applyBonuses(gameState, agency);
            gameState.addAgency(agency);
        }
    }

    @Transactional
    public void leaveAgency(String username) {
        synchronized (username.intern()) {
            GameStateEntity gameState = userService.getGameState(username);

            if (gameState.getAgency() == null) {
                throw new IllegalStateException("You don't have an agency to remove");
            }

            gameState.clearAgency();
            banService.banUser(username, "agency", 15);
        }
    }

    @Transactional
    public void applyPeriodicIncome(String username) {
        GameStateEntity gameState = userService.getGameState(username);

        if (gameState.getAgency() != null && gameState.getLastIncomeDate() != null) {
            LocalDateTime lastIncomeTime = gameState.getLastIncomeDate();
            LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);

            if (lastIncomeTime.plusMinutes(10).isBefore(now)) {
                gameState.addIncome(gameState.getAgency().getIncome());

                //log.info("Applied income {} to user: {}", income, username);
                //System.out.println("Applied income to user: " + username);
            }
        }
    }

    public int getCurrentBalance(String username) {
        applyPeriodicIncome(username);
        GameStateEntity gameState = userService.getGameState(username);
        return gameState.getBalance();
    }

    public boolean areAllRequirementsMet(AgencyEntity agency, GameStateEntity gameState) {
        for (RequirementEntity requirement : agency.getRequirements()) {
            if (!requirementService.isRequirementMet(requirement, gameState)) {
                return false;
            }
        }
        return true;
    }

    private void applyBonuses(GameStateEntity gameState, AgencyEntity agency) {
        gameState.addSubscribers(agency.getSubscriberBonus());
        gameState.addIncome(agency.getIncome());
    }
}