package com.example.backend.application;

import com.example.backend.domain.CollabEntity;
import com.example.backend.domain.GameStateEntity;
import com.example.backend.domain.RequirementEntity;
import com.example.backend.exception.NotFoundException;
import com.example.backend.repo.CollabRepo;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class CollabService {
    private final BanService banService;
    private final CollabRepo collabRepo;
    private final RequirementService requirementService;
    private final UserService userService;

    public CollabService(BanService banService, CollabRepo collabRepo, RequirementService requirementService, UserService userService) {
        this.banService = banService;
        this.collabRepo = collabRepo;
        this.requirementService = requirementService;
        this.userService = userService;
    }

    public List<CollabEntity> all() {
        return collabRepo.findAllWithRequirements();
    }

    public CollabEntity get(String title) {
        return collabRepo.findByTitleWithRequirements(title)
                .orElseThrow(() -> new NotFoundException(HttpStatus.NOT_FOUND, "Collaboration not found"));
    }

    @Transactional
    public void add(CollabEntity collab) {
        collabRepo.save(collab);
    }

    @Transactional
    public void acceptCollab(String username, String collaborationTitle) {
        synchronized (username.intern()) {
            GameStateEntity gameState = userService.getGameState(username);

            if (gameState.getCollab() != null) {
                throw new IllegalStateException("You already have a collaboration");
            }

            String category = "collab";
            if (banService.checkBan(username, category)) {
                throw new IllegalStateException("You are banned until " +
                        banService.getFormattedTime(username, category));
            }

            CollabEntity collab = get(collaborationTitle);

            if (!areAllRequirementsMet(collab, gameState)) {
                throw new IllegalStateException("Not all collaboration requirements are met");
            }

            gameState.addCollab(collab);
        }
    }

    @Transactional
    public void leaveCollab(String username) {
        synchronized (username.intern()) {
            GameStateEntity gameState = userService.getGameState(username);

            if (gameState.getCollab() == null) {
                throw new IllegalStateException("You don't have a collaboration to remove");
            }

            gameState.clearCollab();
            banService.banUser(username, "collab", 10);
        }
    }

    public boolean areAllRequirementsMet(CollabEntity collab, GameStateEntity gameState) {
        for (RequirementEntity requirement : collab.getRequirements()) {
            if (!requirementService.isRequirementMet(requirement, gameState)) {
                return false;
            }
        }
        return true;
    }

    public boolean isCollabCompleted(GameStateEntity gameState) {
        return gameState.getCollab() != null &&
                gameState.getCollaborationStreams() >= gameState.getCollab().getStreamsAmount();
    }
}