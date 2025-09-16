package com.example.backend.exception;

public class InsufficientUsernameException extends RuntimeException {
    public InsufficientUsernameException(String message) {
        super(message);
    }
}
