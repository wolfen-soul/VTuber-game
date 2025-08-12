package com.example.backend.model;

public class GameState {
    private String name;
    private String avatar;
    private String theme;
    private double views = 0;
    private int subscribers = 0;
    private int donations = 0;
    private double viewsPerClick = 1;
    private double viewsPerSecond = 0;
    private double multiplier = 1;
    private String chatMessages = ""; // Накопленные сообщения

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    // Методы для логики (клики, апгрейды) — они остаются, так как это бизнес-логика
    public void clickStream() {
        views += viewsPerClick * multiplier;
        if (Math.random() < 0.2) subscribers++;
        if (Math.random() < 0.1) donations += 10;
        addChatMessage("Фанат: Крутой стрим! +1 лайк!");
    }

    public boolean buyUpgrade(String type) {
        switch (type) {
            case "bot":
                if (views >= 100) { views -= 100; viewsPerSecond += 1; addChatMessage("Куплен бот!"); return true; }
                break;
            case "costume":
                if (views >= 200) { views -= 200; multiplier += 0.5; addChatMessage("Новый костюм!"); return true; }
                break;
            case "collab":
                if (views >= 500) { views -= 500; viewsPerSecond += 5; subscribers += 10; addChatMessage("Коллаб с фениксом!"); return true; }
                break;
        }
        return false;
    }

    // Idle: вызывается таймером на backend
    public void idleUpdate() {
        views += viewsPerSecond * multiplier;
        if (Math.random() < 0.1) addChatMessage(getRandomChatMessage());
    }

    public void addChatMessage(String message) {  // Lombok не генерирует кастомные методы, так что оставляем
        this.chatMessages += "\n" + message;
    }

    private String getRandomChatMessage() {
        String[] messages = {
                "Фанат: Обожаю твой backstory! Ты из другого измерения?",
                "Донат: +50! Спой песню!",
                "Фанат: Когда коллаб с 'кошачьей идол'?",
                "Событие: Фан-митап! +10 подписчиков!"
        };
        return messages[(int) (Math.random() * messages.length)];
    }
}