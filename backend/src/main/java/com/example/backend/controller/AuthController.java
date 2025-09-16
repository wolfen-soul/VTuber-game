package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.backend.application.UserService;
import com.example.backend.dto.request.LoginRequest;
import com.example.backend.dto.request.SignupRequest;
import com.example.backend.exception.InsufficientUsernameException;
import com.example.backend.security.JwtTokenProvider;
import com.example.backend.application.RegistrationLimitService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final RegistrationLimitService registrationLimitService;
    private final HttpServletRequest request;

    public AuthController(AuthenticationManager authenticationManager,
                          UserService userService,
                          JwtTokenProvider jwtTokenProvider,
                          RegistrationLimitService registrationLimitService,
                          HttpServletRequest request) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.registrationLimitService = registrationLimitService;
        this.request = request;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request) {
        if (!userService.existsByUsername(request.getUsername())) {
            throw new InsufficientUsernameException("User with that username does not exist");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        return ResponseEntity.ok(Map.of("token", jwt));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest request) {
        if (userService.existsByUsername(request.getUsername())) {
            throw new InsufficientUsernameException("User with that username already exists");
        }

        if (!registrationLimitService.canRegister(this.request)) {
            throw new InsufficientUsernameException("Registration limit exceeded. Maximum 3 accounts per user allowed.");
        }

        userService.add(request.getUsername(), request.getPassword());
        registrationLimitService.recordRegistration(this.request, request.getUsername());

        return ResponseEntity.ok("User registered successfully!");
    }

    @GetMapping("/registration-limit")
    public ResponseEntity<?> getRegistrationLimit() {
        return ResponseEntity.ok(Map.of("remainingRegistrations",
                registrationLimitService.getRemainingRegistrations(request)));
    }
}