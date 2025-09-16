package com.example.backend.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "factory_sessions")
public class FactorySessionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private int clicks;


    public String getUsername() {
        return username;
    }

    public int getClicks() {
        return clicks;
    }

    protected void setUsername(String username) {
        this.username = username;
    }

    protected void setClicks(int clicks) {
        this.clicks = clicks;
    }

    protected FactorySessionEntity() {}

    public FactorySessionEntity(String username, int clicks) {
        this.username = username;
        this.clicks = clicks;
    }
}
