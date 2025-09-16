package com.example.backend.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "requirements")
public class RequirementEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type;

    @Column
    private Integer value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agency_id")
    private AgencyEntity agency;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collaboration_id")
    private CollabEntity collaboration;


    public String getType() {
        return type;
    }

    public Integer getValue() {
        return value;
    }

    public AgencyEntity getAgency() {
        return agency;
    }

    public CollabEntity getCollaboration() {
        return collaboration;
    }

    protected void setType(String type) {
        this.type = type;
    }

    protected void setValue(Integer value) {
        this.value = value;
    }

    protected void setAgency(AgencyEntity agency) {
        this.agency = agency;
    }

    protected void setCollaboration(CollabEntity collaboration) {
        this.collaboration = collaboration;
    }

    protected RequirementEntity() {}

    public RequirementEntity(String type, Integer value) {
        this.type = type;
        this.value = value;
    }
}