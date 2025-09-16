package com.example.backend.mapper;

import com.example.backend.application.RequirementService;
import com.example.backend.domain.CollabEntity;
import com.example.backend.domain.GameStateEntity;
import com.example.backend.dto.game.CollabDto;
import com.example.backend.dto.game.RequirementDto;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CollabMapper {
    private final RequirementService requirementService;

    public CollabMapper(RequirementService requirementService) {
        this.requirementService = requirementService;
    }

    public CollabDto toDto(CollabEntity collab, GameStateEntity gameState) {
        return new CollabDto(
                collab.getTitle(),
                collab.getMultiplier(),
                collab.getStreamsAmount(),
                collab.getRequirements().stream()
                        .map(req -> new RequirementDto(
                                req.getType(),
                                req.getValue(),
                                requirementService.getCurrentValue(req, gameState),
                                requirementService.isRequirementMet(req, gameState)
                        )).collect(Collectors.toList())
        );
    }
}
