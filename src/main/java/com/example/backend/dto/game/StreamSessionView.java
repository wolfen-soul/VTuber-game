package com.example.backend.dto.game;

public interface StreamSessionView {
    int getLevel();
    double getAccuracy();
    int getClicks();
    int getCorrectClicks();
    int getSubscribers();
    int getCurrentOnline();
    int getIncome();
    int getDonationsAmount();
    long getRemainingTimeMs();
}
