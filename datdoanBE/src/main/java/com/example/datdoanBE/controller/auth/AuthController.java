package com.example.datdoanBE.controller.auth;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.datdoanBE.dto.request.LoginRequest;
import com.example.datdoanBE.dto.request.RegisterRequest;
import com.example.datdoanBE.dto.response.JwtResponse;
import com.example.datdoanBE.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        logger.info("Login attempt for username={}", request.getUsername());
        try {
            var resp = authService.login(request);
            logger.info("Login success for username={}", request.getUsername());
            return ResponseEntity.ok(resp);
        } catch (RuntimeException ex) {
            logger.warn("Login failed for username={}: {}", request.getUsername(), ex.getMessage());
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(new com.example.datdoanBE.dto.response.MessageResponse(ex.getMessage()));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<JwtResponse> refreshToken(@RequestBody String refreshToken) {
        return ResponseEntity.ok(authService.refresh(refreshToken));
    }
}
