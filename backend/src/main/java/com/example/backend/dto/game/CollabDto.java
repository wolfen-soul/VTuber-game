package com.example.backend.dto.game;

import java.util.List;

public record CollabDto(String title, double multiplier, int requiredStreams, List<RequirementDto> requirements) {}
