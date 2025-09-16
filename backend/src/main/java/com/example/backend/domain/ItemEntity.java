package com.example.backend.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "items")
public class ItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private int tier;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private String bonusCategory;

    @Column(nullable = false)
    private double bonus;


    public String getTitle() {
        return title;
    }

    public String getCategory() {
        return category;
    }

    public int getTier() {
        return tier;
    }

    public int getPrice() {
        return price;
    }

    public String getBonusCategory() {
        return bonusCategory;
    }

    public double getBonus() {
        return bonus;
    }

    protected void setTitle(String title) {
        this.title = title;
    }

    protected void setCategory(String category) {
        this.category = category;
    }

    protected void setTier(int tier) {
        this.tier = tier;
    }

    protected void setPrice(int price) {
        this.price = price;
    }

    protected void setBonusCategory(String bonusCategory) {
        this.bonusCategory = bonusCategory;
    }

    protected void setBonus(double bonus) {
        this.bonus = bonus;
    }

    protected ItemEntity() {}

    public ItemEntity(String category, String title, int tier, int price, String bonusCategory, double bonus) {
        this.title = title;
        this.category = category;
        this.tier = tier;
        this.price = price;
        this.bonusCategory = bonusCategory;
        this.bonus = bonus;
    }
}
