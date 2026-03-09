package com.example.datdoanBE.dto.request;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long productId;
    private Integer quantity;
}