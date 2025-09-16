package com.example.backend.application;

import com.example.backend.domain.GameStateEntity;
import com.example.backend.domain.RequirementEntity;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class RequirementService {
    public int getCurrentValue(RequirementEntity requirement, GameStateEntity gameState) {
        return switch (requirement.getType()) {
            case "subscribers" -> gameState.getSubscribers();
            case "streams" -> gameState.getStreamsAmount();
            case "average_online" -> gameState.getAverageOnline();
            case "total_donations" -> gameState.getDonationsAmount();
            case "balance" -> gameState.getBalance();
            default -> 0;
        };
    }

    public boolean isRequirementMet(RequirementEntity requirement, GameStateEntity gameState) {
        return switch (requirement.getType()) {
            case "subscribers" -> gameState.getSubscribers() >= requirement.getValue();
            case "streams" -> gameState.getStreamsAmount() >= requirement.getValue();
            case "average_online" -> gameState.getAverageOnline() >= requirement.getValue();
            case "total_donations" -> gameState.getDonationsAmount() >= requirement.getValue();
            default -> false;
        };
    }
}
