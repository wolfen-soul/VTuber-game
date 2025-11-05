package com.example.backend.controller;

import com.example.backend.application.CollabService;
import com.example.backend.application.UserService;
import com.example.backend.domain.GameStateEntity;
import com.example.backend.dto.game.CollabDto;
import com.example.backend.mapper.CollabMapper;
import com.example.backend.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collabs")
public class CollabController {
    private final CollabMapper collabMapper;
    private final CollabService collabService;
    private final UserService userService;

    public CollabController(CollabMapper collabMapper, CollabService collabService, UserService userService) {
        this.collabMapper = collabMapper;
        this.collabService = collabService;
        this.userService = userService;
    }

    @GetMapping("/catalog")
    public ResponseEntity<?> getCollabsCatalog(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            GameStateEntity gameState = userService.getGameState(userPrincipal.getUsername());
            List<CollabDto> collabs = collabService.all().stream()
                    .map(collab -> collabMapper.toDto(collab, gameState))
                    .toList();
            return ResponseEntity.ok(collabs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error loading collabs");
        }
    }

    @GetMapping("/owned")
    public ResponseEntity<?> getCollab(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            GameStateEntity gameState = userService.getGameState(userPrincipal.getUsername());

            if (gameState.getCollab() == null) {
                return ResponseEntity.notFound().build();
            }
            CollabDto dto = collabMapper.toDto(gameState.getCollab(), gameState);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error loading collab");
        }
    }

    @PostMapping("/accept/{collab}")
    public ResponseEntity<?> acceptCollab(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                          @PathVariable("collab") String collabTitle) {
        try {
            collabService.acceptCollab(userPrincipal.getUsername(), collabTitle);
            return ResponseEntity.ok("Collab is accepted");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error accepting collab");
        }
    }

    @DeleteMapping("")
    public ResponseEntity<?> removeCollab(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            collabService.leaveCollab(userPrincipal.getUsername());
            return ResponseEntity.ok("Collab is successfully removed");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error removing collab");
        }
    }
}
