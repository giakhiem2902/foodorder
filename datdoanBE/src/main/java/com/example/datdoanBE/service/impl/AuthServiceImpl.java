package com.example.datdoanBE.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.datdoanBE.dto.request.LoginRequest;
import com.example.datdoanBE.dto.request.RegisterRequest;
import com.example.datdoanBE.dto.response.JwtResponse;
import com.example.datdoanBE.dto.response.MessageResponse;
import com.example.datdoanBE.entity.Role;
import com.example.datdoanBE.entity.User;
import com.example.datdoanBE.entity.enums.ERole;
import com.example.datdoanBE.repository.RoleRepository;
import com.example.datdoanBE.repository.UserRepository;
import com.example.datdoanBE.security.jwt.JwtUtils;
import com.example.datdoanBE.security.services.UserDetailsImpl;
import com.example.datdoanBE.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    @Transactional
    public MessageResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .build();

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy quyền USER."));
        roles.add(userRole);
        user.setRoles(roles);

        userRepository.save(user);
        return new MessageResponse("Đăng ký thành công!");
    }

    @Override
    public JwtResponse login(LoginRequest request) {
    // Manual authentication to give clearer errors when passwords don't match or user not found
    User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));
    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        // If password in DB is not yet encoded (legacy data), allow plain-text match and upgrade to encoded
        if (user.getPassword() != null && user.getPassword().equals(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);
        } else {
            throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng");
        }
    }

    // Build UserDetails and Authentication manually
    UserDetailsImpl userDetails = UserDetailsImpl.build(user);
    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    SecurityContextHolder.getContext().setAuthentication(authentication);

    String jwt = jwtUtils.generateJwtToken(authentication);

    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    return JwtResponse.builder()
        .token(jwt)
        .id(userDetails.getId())
        .username(userDetails.getUsername())
        .fullName(userDetails.getFullName())
        .email(userDetails.getEmail())
        .phone(userDetails.getPhone())
        .roles(roles)
        .build();
    }
    @Override
    public JwtResponse refresh(String refreshToken) {
        throw new UnsupportedOperationException("Tính năng đang phát triển.");
    }
}