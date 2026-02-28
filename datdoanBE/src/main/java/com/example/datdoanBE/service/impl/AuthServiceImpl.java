package com.example.datdoanBE.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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
    private final AuthenticationManager authenticationManager;

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
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

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