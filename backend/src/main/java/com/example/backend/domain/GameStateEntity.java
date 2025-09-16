package com.example.backend.domain;

import com.example.backend.exception.InsufficientBalanceException;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Entity
@Table(name = "game_states")
public class GameStateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private int subscribers;

    @Column(nullable = false)
    private int streamsAmount;

    @Column(nullable = false)
    private int averageOnline;

    @Column(nullable = false)
    private int balance;

    @Column(nullable = false)
    private int donationsAmount;

    @Column(nullable = false)
    private LocalDateTime registrationDate;

    @Column(nullable = false)
    private boolean activeStream;

    @Column(nullable = false)
    private int collaborationStreams;

    @Column(name = "agency_join_time")
    private LocalDateTime agencyJoinDate;

    @Column(name = "last_income_time")
    private LocalDateTime lastIncomeDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agency_id")
    private AgencyEntity agency;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collab_id")
    private CollabEntity collab;

    @ElementCollection
    @CollectionTable(name = "online_history", joinColumns = @JoinColumn(name = "game_state_id"))
    @Column(name = "online_history")
    private List<Integer> onlineHistory;

    @ManyToMany
    @JoinTable(
            name = "user_items",
            joinColumns = @JoinColumn(name = "game_state_id"),
            inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    private List<ItemEntity> ownedItems;


    public String getNickname() {
        return nickname;
    }

    public int getSubscribers() {
        return subscribers;
    }

    public int getStreamsAmount() {
        return streamsAmount;
    }

    public int getAverageOnline() {
        return averageOnline;
    }

    public int getBalance() {
        return balance;
    }

    public int getDonationsAmount() {
        return donationsAmount;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public boolean isActiveStream() {
        return  activeStream;
    }

    public Integer getCollaborationStreams() {
        return collaborationStreams;
    }

    public LocalDateTime getAgencyJoinDate() {
        return agencyJoinDate;
    }

    public LocalDateTime getLastIncomeDate() {
        return lastIncomeDate;
    }

    public AgencyEntity getAgency() {
        return agency;
    }

    public CollabEntity getCollab() {
        return collab;
    }

    public List<Integer> getOnlineHistory() {
        return onlineHistory;
    }

    public List<ItemEntity> getOwnedItems() {
        return ownedItems;
    }

    protected void setNickname(String nickname) {
        this.nickname = nickname;
    }

    protected void setSubscribers(int subscribers) {
        this.subscribers = subscribers;
    }

    protected void setStreamsAmount(int streamsAmount) {
        this.streamsAmount = streamsAmount;
    }

    protected void setAverageOnline(int averageOnline) {
        this.averageOnline = averageOnline;
    }

    protected void setBalance(int balance) {
        this.balance = balance;
    }

    protected void setDonationsAmount(int donationsAmount) {
        this.donationsAmount = donationsAmount;
    }

    protected void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    protected void setActiveStream(boolean activeStream) {
        this.activeStream = activeStream;
    }

    protected void setCollaborationStreams(Integer collaborationStreams) {
        this.collaborationStreams = collaborationStreams;
    }

    protected void setAgencyJoinDate(LocalDateTime agencyJoinDate) {
        this.agencyJoinDate = agencyJoinDate;
    }

    protected void setLastIncomeDate(LocalDateTime lastIncomeDate) {
        this.lastIncomeDate = lastIncomeDate;
    }

    protected void setAgency(AgencyEntity agency) {
        this.agency = agency;
    }

    protected void setCollab(CollabEntity collab) {
        this.collab = collab;
    }

    protected void setOnlineHistory(List<Integer> onlineHistory) {
        this.onlineHistory = onlineHistory;
    }

    protected void setOwnedItems(List<ItemEntity> ownedItems) {
        this.ownedItems = ownedItems;
    }

    protected GameStateEntity() {}


    public static GameStateEntity create(String nickname) {
        GameStateEntity gameState = new GameStateEntity();
        gameState.setNickname(nickname);
        gameState.setSubscribers(0);
        gameState.setStreamsAmount(0);
        gameState.setAverageOnline(0);
        gameState.setBalance(56000);
        gameState.setDonationsAmount(0);
        gameState.setRegistrationDate(LocalDateTime.now(ZoneOffset.UTC));
        gameState.setActiveStream(false);
        gameState.setCollaborationStreams(0);
        gameState.setAgency(null);
        gameState.setCollab(null);
        gameState.setAgencyJoinDate(null);
        gameState.setLastIncomeDate(null);
        gameState.setOnlineHistory(new ArrayList<>());

        gameState.setOwnedItems(new ArrayList<>());
        return gameState;
    }

    public int getDiscountedPrice(ItemEntity item) {
        if (this.agency != null) {
            return this.agency.getDiscountedPrice(item.getPrice());
        }
        return item.getPrice();
    }

    public String getFormattedRegistrationTime() {
        return registrationDate.atZone(ZoneOffset.UTC)
                .withZoneSameInstant(ZoneId.of("Europe/Moscow"))
                .format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss"));
    }

    public void addSubscribers(int subscribers) {
        this.subscribers += subscribers;
    }

    public void incrementStreamsAmount() {
        this.streamsAmount++;
        if (this.collab != null) {
            this.collaborationStreams++;
        }
    }

    public void updateAverageOnline(int averageOnline) {
        this.averageOnline = averageOnline;
    }

    public void addIncome(int income) {
        this.balance += income;
        this.lastIncomeDate = LocalDateTime.now(ZoneOffset.UTC);
    }

    public void updateDonationsAmount(int donationsAmount) {
        this.donationsAmount += donationsAmount;
    }

    public void activateStream() {
        this.activeStream = true;
    }

    public void deactivateStream() {
        this.activeStream = false;
    }

    public void purchaseItem(ItemEntity newItem) {
        int finalPrice = getDiscountedPrice(newItem);

        if (finalPrice > this.balance) {
            throw new InsufficientBalanceException("Not enough money");
        }

        Optional<ItemEntity> itemToRemove = this.ownedItems.stream()
                .filter(item -> item.getCategory().equals(newItem.getCategory()))
                .filter(item -> item.getTier() < newItem.getTier())
                .max(Comparator.comparingInt(ItemEntity::getTier));

        itemToRemove.ifPresent(this.ownedItems::remove);
        this.balance -= finalPrice;
        this.ownedItems.add(newItem);
    }

    public void addAgency(AgencyEntity agency) {
        this.agency = agency;
        this.agencyJoinDate = LocalDateTime.now(ZoneOffset.UTC);
        this.lastIncomeDate = LocalDateTime.now(ZoneOffset.UTC);
    }

    public void addCollab(CollabEntity collab) {
        this.collab = collab;
    }

    public void clearAgency() {
        this.agency = null;
    }

    public void clearCollab() {
        this.collab = null;
        this.collaborationStreams = 0;
    }

    public void clearOwnedItems() {
        this.ownedItems.clear();
    }
}
