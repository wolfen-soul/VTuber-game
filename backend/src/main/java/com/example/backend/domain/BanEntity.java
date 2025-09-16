package com.example.backend.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "bans")
public class BanEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private LocalDateTime banEndTime;

    public String getUsername() {
        return username;
    }

    public String getCategory() {
        return category;
    }

    public LocalDateTime getBanEndTime() {
        return banEndTime;
    }

    protected void setUsername(String username) {
        this.username = username;
    }

    protected void setCategory(String category) {
        this.username = username;
    }

    protected void setBanEndTime(LocalDateTime banEndTime) {
        this.banEndTime = banEndTime;
    }

    protected BanEntity() {}

    public BanEntity(String username, String category, LocalDateTime banEndTime) {
        this.username = username;
        this.category = category;
        this.banEndTime = banEndTime;
    }


    public boolean isExpired() {
        return LocalDateTime.now(ZoneOffset.UTC).isAfter(banEndTime);
    }
}
