package com.example.datdoanBE.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private Double totalPrice;
    private String status;
    private LocalDateTime createdAt;
    private String message;
}