package com.example.datdoanBE.service;

import com.example.datdoanBE.dto.request.LoginRequest;
import com.example.datdoanBE.dto.request.RegisterRequest;
import com.example.datdoanBE.dto.response.JwtResponse;
import com.example.datdoanBE.dto.response.MessageResponse;

public interface AuthService {
    MessageResponse register(RegisterRequest request);
    JwtResponse login(LoginRequest request);
    JwtResponse refresh(String refreshToken);
}