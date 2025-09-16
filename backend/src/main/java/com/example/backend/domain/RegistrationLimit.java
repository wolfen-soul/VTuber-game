package com.example.backend.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@Table(name = "registration_limits")
public class RegistrationLimit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String ipAddress;

    @Column(nullable = false)
    private String deviceFingerprint;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private LocalDateTime registrationDate;

    @Column(nullable = false)
    private boolean active = true;


    public String getIpAddress() {
        return ipAddress;
    }

    public String getDeviceFingerprint() {
        return deviceFingerprint;
    }

    public String getUsername() {
        return username;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public boolean isActive() {
        return active;
    }

    protected void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    protected void setDeviceFingerprint(String deviceFingerprint) {
        this.deviceFingerprint = deviceFingerprint;
    }

    protected void setUsername(String username) {
        this.username = username;
    }

    protected void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    protected void setActive(boolean active) {
        this.active = active;
    }

    protected RegistrationLimit() {}

    public RegistrationLimit(String ipAddress, String deviceFingerprint, String username) {
        this.ipAddress = ipAddress;
        this.deviceFingerprint = deviceFingerprint;
        this.username = username;
        this.registrationDate = LocalDateTime.now(ZoneOffset.UTC);
    }
}