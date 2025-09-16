package com.example.backend.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "stream_sessions")
public class StreamSessionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private int level;

    @Column(nullable = false)
    private double accuracy;

    @Column(nullable = false)
    private int clicks;

    @Column(nullable = false)
    private int correctClicks;

    @Column(nullable = false)
    private int subscribers;

    @Column(nullable = false)
    private int currentOnline;

    @Column(nullable = false)
    private int income;

    @Column(nullable = false)
    private int donationsAmount;

    @Column(nullable = false)
    private long remainingTimeMs;


    public String getUsername() {
        return username;
    }

    public int getLevel() {
        return level;
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

    public void setUsername(String username) {
        this.username = username;
    }

    protected void setLevel(int level) {
        this.level = level;
    }

    protected void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    protected void setClicks(int clicks) {
        this.clicks = clicks;
    }

    protected void setCorrectClicks(int correctClicks) {
        this.correctClicks = correctClicks;
    }

    protected void setSubscribers(int subscribers) {
        this.subscribers = subscribers;
    }

    protected void setCurrentOnline(int currentOnline) {
        this.currentOnline = currentOnline;
    }

    protected void setIncome(int income) {
        this.income = income;
    }

    protected void setDonationsAmount(int donationsAmount) {
        this.donationsAmount = donationsAmount;
    }

    protected void setRemainingTimeMs(long remainingTimeMs) {
        this.remainingTimeMs = remainingTimeMs;
    }

    protected StreamSessionEntity() {}

    public StreamSessionEntity(String username, int level, int clicks, int correctClicks, double accuracy, int subscribers,
                               int currentOnline, int income, int donationsAmount, long remainingTimeMs) {
        this.username = username;
        this.level = level;
        this.clicks = clicks;
        this.correctClicks = correctClicks;
        this.accuracy = accuracy;
        this.subscribers = subscribers;
        this.currentOnline = currentOnline;
        this.income = income;
        this.donationsAmount = donationsAmount;
        this.remainingTimeMs = remainingTimeMs;
    }
}
