package com.example.backend.application;

import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@EnableScheduling
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class SchedulerService {
    private final AgencyService agencyService;
    private final UserService userService;

    public SchedulerService(AgencyService agencyService, UserService userService) {
        this.agencyService = agencyService;
        this.userService = userService;
    }

    @Scheduled(fixedRate = 60 * 1000)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void checkAndApplyIncomes() {
        List<String> usernamesWithAgency = userService.getAllUsernamesWithAgency();

        for (String username : usernamesWithAgency) {
            try {
                agencyService.applyPeriodicIncome(username);
            } catch (Exception e) {
                //log.error("Failed to process income for user: {}", username, e);
                System.out.println("Failed to process income for user: " + username);
                System.out.println("Error: " + e);
            }
        }
    }
}