package com.example.backend.dto.response;

import java.util.List;

public record JwtResponse(String username, List<String> roles, String token) {}