package com.example.datdoanBE.controller.client;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.datdoanBE.dto.request.UpdateProfileRequest;
import com.example.datdoanBE.dto.response.UserResponse;
import com.example.datdoanBE.entity.User;
import com.example.datdoanBE.repository.UserRepository;
import com.example.datdoanBE.security.services.UserDetailsImpl;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserClientController {
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = principal.getId();
        User user = userRepository.findById(userId).orElseThrow();
        UserResponse resp = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .build();
        return ResponseEntity.ok(resp);
    }

    @PutMapping
    public ResponseEntity<UserResponse> update(@RequestBody UpdateProfileRequest req) {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = principal.getId();
        User user = userRepository.findById(userId).orElseThrow();

        if (req.getFullName() != null) user.setFullName(req.getFullName());
        if (req.getEmail() != null) user.setEmail(req.getEmail());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getAddress() != null) user.setAddress(req.getAddress());

        User updated = userRepository.save(user);

        UserResponse resp = UserResponse.builder()
                .id(updated.getId())
                .username(updated.getUsername())
                .fullName(updated.getFullName())
                .email(updated.getEmail())
                .phone(updated.getPhone())
                .address(updated.getAddress())
                .build();

        return ResponseEntity.ok(resp);
    }
}
