package com.example.backend.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "agencies")
public class AgencyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String title;

    @Column(nullable = false)
    private int subscriberBonus;

    @Column(nullable = false)
    private int income;

    @Column(nullable = false)
    private double discount;

    @OneToMany(mappedBy = "agency", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RequirementEntity> requirements;


    public String getTitle() {
        return title;
    }

    public int getSubscriberBonus() {
        return subscriberBonus;
    }

    public int getIncome() {
        return income;
    }

    public double getDiscount() {
        return discount;
    }

    public List<RequirementEntity> getRequirements() {
        return requirements;
    }

    protected void setTitle(String title) {
        this.title = title;
    }

    protected void setSubscriberBonus(int subscriberBonus) {
        this.subscriberBonus = subscriberBonus;
    }

    protected void setIncome(int income) {
        this.income = income;
    }

    protected void setDiscount(double discount) {
        this.discount = discount;
    }

    protected void setRequirements(List<RequirementEntity> requirements) {
        this.requirements = requirements;
    }

    protected AgencyEntity() {}

    public AgencyEntity(String title, int subscriberBonus, int income, double discount) {
        this.title = title;
        this.subscriberBonus = subscriberBonus;
        this.income = income;
        this.discount = discount;
        this.requirements = new ArrayList<>();
    }


    public int getDiscountedPrice(int price) {
        return (int) Math.round(price * (1 - discount));
    }

    public void addRequirement(RequirementEntity requirement) {
        requirement.setAgency(this);
        this.requirements.add(requirement);
    }
}