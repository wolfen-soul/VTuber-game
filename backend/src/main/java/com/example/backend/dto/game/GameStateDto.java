package com.example.backend.dto.game;

import java.util.List;

public record GameStateDto(String nickname, int subscribers, int streamsAmount, int averageOnline, int balance,
                           int donationsAmount, String registrationDate, Integer collaborationStreams,
                           AgencyDto agency, CollabDto collab, List<ItemDto> ownedItems, boolean activeStream) {}
