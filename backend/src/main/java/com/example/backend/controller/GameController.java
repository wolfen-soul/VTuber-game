package com.example.backend.controller;

import com.example.backend.application.GameService;
import com.example.backend.application.UserService;
import com.example.backend.domain.GameStateEntity;
import com.example.backend.dto.game.GameStateDto;
import com.example.backend.dto.game.WolfRequirementsDto;
import com.example.backend.mapper.GameStateMapper;
import com.example.backend.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
public class GameController {
    private final GameStateMapper gameStateMapper;
    private final GameService gameService;
    private final UserService userService;

    public GameController(GameStateMapper gameStateMapper, GameService gameService, UserService userService) {
        this.gameStateMapper = gameStateMapper;
        this.gameService = gameService;
        this.userService = userService;
    }

    @PostMapping("/init")
    public ResponseEntity<?> createGameState(@AuthenticationPrincipal UserPrincipal userPrincipal, @RequestParam String nickname) {
        userService.createGameState(userPrincipal.getUsername(), nickname);
        return ResponseEntity.ok(String.join("'", "The channel ", nickname, " is set up"));
    }

    @GetMapping("/state")
    public ResponseEntity<GameStateDto> loadGameState(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        GameStateEntity gameState = userService.getGameState(userPrincipal.getUsername());
        return ResponseEntity.ok(gameStateMapper.toDto(gameState));
    }

    @DeleteMapping("/account")
    public ResponseEntity<?> deleteAccount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        boolean deleted = userService.remove(userPrincipal.getUsername());

        if (deleted) {
            return ResponseEntity.ok().body("Your account has been deleted successfully");
        }
        return ResponseEntity.badRequest().body("Failed to delete account");
    }

    @PostMapping("/stream/start")
    public ResponseEntity<?> startStream(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                         @RequestParam int level) {
        try {
            return ResponseEntity.ok(gameService.startStream(userPrincipal.getUsername(), level));
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/stream/click")
    public ResponseEntity<?> clickStream(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                         @RequestParam boolean clickStatus) {
        try {
            return ResponseEntity.ok(gameService.registerStreamClick(userPrincipal.getUsername(), clickStatus));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/stream/save")
    public ResponseEntity<?> saveStream(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                        @RequestParam long remainingTime) {
        try {
            gameService.saveStream(userPrincipal.getUsername(), remainingTime);
            return ResponseEntity.ok("Stream saved successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/stream/finish")
    public ResponseEntity<?> finishStream(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            return ResponseEntity.ok(gameService.finishStream(userPrincipal.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/factory/start")
    public ResponseEntity<?> startFactory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            return ResponseEntity.ok(gameService.startFactory(userPrincipal.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/factory/click")
    public ResponseEntity<?> clickFactory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            return ResponseEntity.ok(gameService.registerFactoryClick(userPrincipal.getUsername()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/factory/save")
    public ResponseEntity<?> saveFactory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            gameService.saveFactory(userPrincipal.getUsername());
            return ResponseEntity.ok("Factory saved successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/factory/finish")
    public ResponseEntity<?> finishFactory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            gameService.finishFactory(userPrincipal.getUsername());
            return ResponseEntity.ok("Factory finished successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/wolf/requirements")
    public ResponseEntity<?> checkWolfRequirements(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        GameStateEntity gameState = userService.getGameState(userPrincipal.getUsername());

        return ResponseEntity.ok(new WolfRequirementsDto(
                gameState.getSubscribers(), gameState.getBalance(), gameState.calculateMinutesSinceRegistration()
        ));
    }

    @PostMapping("/wolf/signContract")
    public ResponseEntity<?> signWolfContract(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        GameStateEntity gameState = userService.getGameState(userPrincipal.getUsername());

        if (!userService.areWolfRequirementsMet(gameState)) {
            return ResponseEntity.badRequest().body("Not all requirements are met");
        }

        return ResponseEntity.ok("b01aed886c1e3032610b9f9f8a7d0219a2ed186b95a8bb90c41a0836a9c6cd92");
    }
}
