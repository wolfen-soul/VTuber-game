package com.example.backend.mapper;

import com.example.backend.application.RequirementService;
import com.example.backend.domain.AgencyEntity;
import com.example.backend.domain.GameStateEntity;
import com.example.backend.dto.game.AgencyDto;
import com.example.backend.dto.game.RequirementDto;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;


@Component
public class AgencyMapper {
    private final RequirementService requirementService;

    public AgencyMapper(RequirementService requirementService) {
        this.requirementService = requirementService;
    }

    public AgencyDto toDto(AgencyEntity agency, GameStateEntity gameState) {
        return new AgencyDto(
                agency.getTitle(),
                agency.getSubscriberBonus(),
                agency.getIncome(),
                agency.getDiscount(),
                agency.getRequirements().stream()
                        .map(req -> new RequirementDto(
                                req.getType(),
                                req.getValue(),
                                requirementService.getCurrentValue(req, gameState),
                                requirementService.isRequirementMet(req, gameState)
                        )).collect(Collectors.toList())
        );
    }
}
