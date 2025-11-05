package com.example.backend.application;

import com.example.backend.domain.GameStateEntity;
import com.example.backend.repo.*;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.backend.domain.UserEntity;
import com.example.backend.exception.NotFoundException;

import java.util.List;

@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwdEnc;
    private final StreamSessionRepo streamSessionRepository;
    private final FactorySessionRepo factorySessionRepository;
    private final BanRepo banRepository;
    private final RegistrationLimitService registrationLimitService;

    public UserService(UserRepo userRepo, PasswordEncoder passwdEnc,
                       StreamSessionRepo streamSessionRepository,
                       FactorySessionRepo factorySessionRepository,
                       BanRepo banRepository,
                       RegistrationLimitService registrationLimitService) {
        this.userRepo = userRepo;
        this.passwdEnc = passwdEnc;
        this.streamSessionRepository = streamSessionRepository;
        this.factorySessionRepository = factorySessionRepository;
        this.banRepository = banRepository;
        this.registrationLimitService = registrationLimitService;
    }

    public boolean existsByUsername(String username) {
        return userRepo.existsByUsername(username);
    }

    @Transactional
    public UserEntity get(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new NotFoundException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Transactional
    public void edit(String username, UserEntity user) {
        if (!userRepo.existsByUsername(username)) {
            throw new NotFoundException(HttpStatus.NOT_FOUND, "User not found");
        }
        userRepo.save(user);
    }

    @Transactional
    public void add(String username, String password) {
        userRepo.save(new UserEntity(username, passwdEnc.encode(password)));
    }

    @Transactional
    public boolean remove(String username) {
        UserEntity user = userRepo.findByUsername(username)
                .orElseThrow(() -> new NotFoundException(HttpStatus.NOT_FOUND, "User not found"));

        deleteUserRelatedData(user);
        userRepo.delete(user);
        registrationLimitService.releaseRegistration(username);

        return true;
    }

    public List<String> getAllUsernamesWithAgency() {
        return userRepo.findAllUsernamesWithAgency();
    }

    @Transactional
    public GameStateEntity getGameState(String username) {
        UserEntity user = get(username);

        if (user.getGameState() == null) {
            throw new NotFoundException(HttpStatus.NOT_FOUND, "Game state not found");
        }

        Hibernate.initialize(user.getGameState().getOwnedItems());
        Hibernate.initialize(user.getGameState().getAgency());
        Hibernate.initialize(user.getGameState().getCollab());
        return user.getGameState();
    }

    public boolean areWolfRequirementsMet(GameStateEntity gameState) {
        return gameState.getSubscribers() >= 100000 &&
                gameState.getBalance() >= 500000 &&
                gameState.calculateMinutesSinceRegistration() >= 180;
    }

    @Transactional
    public void createGameState(String username, String nickname) {
        UserEntity user = userRepo.findByUsername(username)
                .orElseThrow(() -> new NotFoundException(HttpStatus.NOT_FOUND, "User not found"));
        user.createGameState(nickname);
    }

    private void deleteUserRelatedData(UserEntity user) {
        String username = user.getUsername();
        user.clearGameState();
        streamSessionRepository.deleteByUsername(username);
        factorySessionRepository.deleteByUsername(username);
        banRepository.deleteByUsername(username);

        userRepo.save(user);
    }
}