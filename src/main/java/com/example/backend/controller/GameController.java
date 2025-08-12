package com.example.backend.controller;

import com.example.backend.model.GameState;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Timer;
import java.util.TimerTask;

@RestController
@RequestMapping("/api")
public class GameController {

    private GameState state = new GameState(); // Состояние в памяти (для одного пользователя; для multi — используйте Map или БД)
    private Timer idleTimer;

    public GameController() {
        // Запуск idle-таймера на backend
        idleTimer = new Timer();
        idleTimer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                state.idleUpdate();
            }
        }, 1000, 1000);
    }

    @PostMapping("/start")
    public ResponseEntity<GameState> startGame(@RequestBody GameState initialState) {
        state.setName(initialState.getName());
        state.setAvatar(initialState.getAvatar());
        state.setTheme(initialState.getTheme());
        return ResponseEntity.ok(state);
    }

    @GetMapping("/state")
    public ResponseEntity<GameState> getState() {
        return ResponseEntity.ok(state);
    }

    @PostMapping("/click")
    public ResponseEntity<GameState> clickStream() {
        state.clickStream();
        return ResponseEntity.ok(state);
    }

    @PostMapping("/upgrade")
    public ResponseEntity<GameState> buyUpgrade(@RequestParam String type) {
        boolean success = state.buyUpgrade(type);
        if (success) {
            return ResponseEntity.ok(state);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}