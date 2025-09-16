package com.example.backend.mapper;

import com.example.backend.domain.GameStateEntity;
import com.example.backend.dto.game.GameStateDto;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class GameStateMapper {
    private final AgencyMapper agencyMapper;
    private final CollabMapper collabMapper;
    private final ItemMapper itemMapper;

    public GameStateMapper(AgencyMapper agencyMapper, CollabMapper collabMapper, ItemMapper itemMapper) {
        this.agencyMapper = agencyMapper;
        this.collabMapper = collabMapper;
        this.itemMapper = itemMapper;
    }

    public GameStateDto toDto(GameStateEntity gameState) {
        return new GameStateDto(
                gameState.getNickname(),
                gameState.getSubscribers(),
                gameState.getStreamsAmount(),
                gameState.getAverageOnline(),
                gameState.getBalance(),
                gameState.getDonationsAmount(),
                gameState.getFormattedRegistrationTime(),
                gameState.getCollaborationStreams(),
                gameState.getAgency() != null ? agencyMapper.toDto(gameState.getAgency(), gameState) : null,
                gameState.getCollab() != null ? collabMapper.toDto(gameState.getCollab(), gameState) : null,
                gameState.getOwnedItems().stream()
                        .map(itemMapper::toDto)
                        .collect(Collectors.toList()),
                gameState.isActiveStream()
        );
    }
}
