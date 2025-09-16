package com.example.backend.controller;

import com.example.backend.application.UserService;
import com.example.backend.domain.GameStateEntity;
import com.example.backend.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/wolf")
public class WolfController {       //FIXME: REWRITE
    private final UserService userService;

    public WolfController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/requirements")
    public ResponseEntity<?> getWolfRequirements(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        GameStateEntity gameState = userService.getGameState(userPrincipal.getUsername());

        long minutesSinceRegistration = calculateMinutesSinceRegistration(gameState.getRegistrationDate()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        WolfRequirementsResponse response = new WolfRequirementsResponse(
                gameState.getSubscribers(),
                gameState.getBalance(),
                minutesSinceRegistration
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signContract")
    public ResponseEntity<?> signWolfContract(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        GameStateEntity gameState = userService.getGameState(userPrincipal.getUsername());

        if (!areWolfRequirementsMet(gameState)) {
            return ResponseEntity.badRequest().body("Not all requirements are met");
        }

        WolfContractResponse response = new WolfContractResponse(
                "b01aed886c1e3032610b9f9f8a7d0219a2ed186b95a8bb90c41a0836a9c6cd92"
        );

        return ResponseEntity.ok(response);
    }

    private boolean areWolfRequirementsMet(GameStateEntity gameState) {
        long minutesSinceRegistration = calculateMinutesSinceRegistration(gameState.getRegistrationDate()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        return gameState.getSubscribers() >= 100000 &&
                gameState.getBalance() >= 500000 &&
                minutesSinceRegistration >= 180;
    }

    private long calculateMinutesSinceRegistration(String registrationDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime regDate = LocalDateTime.parse(registrationDate, formatter);
            LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);

            return Duration.between(regDate, now).toMinutes();
        } catch (Exception e) {
            return 0;
        }
    }

    // DTO классы
    public record WolfRequirementsResponse(int subscribers, int balance, long minutesSinceRegistration) {}
    public record WolfContractResponse(String flag) {}
}