package com.example.backend.domain;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "game_state_id", referencedColumnName = "id")
    private GameStateEntity gameState;

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public GameStateEntity getGameState() {
        return gameState;
    }

    protected void setUsername(String username) {
        this.username = username;
    }

    protected void setPassword(String password) {
        this.password = password;
    }

    protected void setRole(String role) {
        this.role = role;
    }

    protected void setGameState(GameStateEntity gameState) {
        this.gameState = gameState;
    }

    protected UserEntity() {}

    public UserEntity(String username, String password) {
        this.username = username;
        this.password = password;
        this.role = "USER";
        this.gameState = null;
    }


    public void createGameState(String nickname) {
        if (this.gameState != null) {
            throw new IllegalStateException("User already has a game state");
        }
        this.gameState = GameStateEntity.create(nickname);
    }

    public void clearGameState() {
        if (this.gameState != null) {
            this.gameState.clearOwnedItems();
            this.gameState = null;
        }
    }
}