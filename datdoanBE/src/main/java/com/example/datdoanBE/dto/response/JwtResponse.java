package com.example.datdoanBE.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String accessToken;
    private String refreshToken;
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private List<String> roles;
}