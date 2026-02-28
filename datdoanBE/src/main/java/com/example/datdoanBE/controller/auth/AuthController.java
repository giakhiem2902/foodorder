package com.example.datdoanBE.controller.auth;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.datdoanBE.dto.request.LoginRequest;
import com.example.datdoanBE.dto.request.RegisterRequest;
import com.example.datdoanBE.dto.response.JwtResponse;
import com.example.datdoanBE.entity.User;
import com.example.datdoanBE.repository.UserRepository;
import com.example.datdoanBE.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        // 👇 ĐẶT DEBUG Ở ĐÂY
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();

        System.out.println("RAW: " + request.getPassword());
        System.out.println("ENCODED DB: " + user.getPassword());
        System.out.println("MATCH: " + passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        ));
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        return ResponseEntity.ok("Login success");
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<JwtResponse> refreshToken(@RequestBody String refreshToken) {
        return ResponseEntity.ok(authService.refresh(refreshToken));
    }
}
