package com.example.backend.dto.game;

import java.util.List;

public record AgencyDto(String title, int subscriberBonus, int income, double discount, List<RequirementDto> requirements) {}