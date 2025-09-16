package com.example.backend.dto.game;

public record RequirementDto(String type, Integer value, Integer currentValue, Boolean completed) {}
