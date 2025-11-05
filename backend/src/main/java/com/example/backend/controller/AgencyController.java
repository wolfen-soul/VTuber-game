package com.example.backend.controller;

import com.example.backend.application.AgencyService;
import com.example.backend.application.UserService;
import com.example.backend.domain.GameStateEntity;
import com.example.backend.dto.game.AgencyDto;
import com.example.backend.mapper.AgencyMapper;
import com.example.backend.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agencies")
public class AgencyController {
    private final AgencyMapper agencyMapper;
    private final AgencyService agencyService;
    private final UserService userService;

    public AgencyController(AgencyMapper agencyMapper, AgencyService agencyService, UserService userService) {
        this.agencyMapper = agencyMapper;
        this.agencyService = agencyService;
        this.userService = userService;
    }

    @GetMapping("/catalog")
    public ResponseEntity<?> getAgenciesCatalog(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            GameStateEntity gameState = userService.getGameState(userPrincipal.getUsername());
            List<AgencyDto> agencies = agencyService.all().stream()
                    .map(agency -> agencyMapper.toDto(agency, gameState))
                    .toList();
            return ResponseEntity.ok(agencies);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error loading agencies");
        }
    }

    @GetMapping("/owned")
    public ResponseEntity<?> getAgency(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            GameStateEntity gameState = userService.getGameState(userPrincipal.getUsername());

            if (gameState.getAgency() == null) {
                return ResponseEntity.notFound().build();
            }
            AgencyDto dto = agencyMapper.toDto(gameState.getAgency(), gameState);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error loading agency");
        }
    }

    @PostMapping("/accept/{agency}")
    public ResponseEntity<?> acceptAgency(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                          @PathVariable("agency") String agencyTitle) {
       try {
           agencyService.acceptAgency(userPrincipal.getUsername(), agencyTitle);
           return ResponseEntity.ok("Agency is accepted");
       } catch (IllegalStateException e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       } catch (Exception e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body("Error accepting agency");
       }
    }

    @DeleteMapping("")
    public ResponseEntity<?> removeAgency(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            agencyService.leaveAgency(userPrincipal.getUsername());
            return ResponseEntity.ok("Agency is successfully removed");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error removing agency");
        }
    }
}
