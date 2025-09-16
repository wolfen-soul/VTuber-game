package com.example.backend.domain;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "collabs")
public class CollabEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String title;

    @Column(nullable = false)
    private double multiplier;

    @Column(nullable = false)
    private int streamsAmount;

    @OneToMany(mappedBy = "collaboration", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequirementEntity> requirements;


    public String getTitle() {
        return title;
    }

    public double getMultiplier() {
        return multiplier;
    }

    public int getStreamsAmount() {
        return streamsAmount;
    }

    public List<RequirementEntity> getRequirements() {
        return requirements;
    }

    protected void setTitle(String title) {
        this.title = title;
    }

    protected void setMultiplier(double multiplier) {
        this.multiplier = multiplier;
    }

    protected void setStreamsAmount(int streamsAmount) {
        this.streamsAmount = streamsAmount;
    }

    protected void setRequirements(List<RequirementEntity> requirements) {
        this.requirements = requirements;
    }

    protected CollabEntity() {}

    public CollabEntity(String title, double multiplier, int streamsAmount) {
        this.title = title;
        this.multiplier = multiplier;
        this.streamsAmount = streamsAmount;
        this.requirements = new ArrayList<>();
    }


    public void addRequirement(RequirementEntity requirement) {
        requirement.setCollaboration(this);
        this.requirements.add(requirement);
    }
}