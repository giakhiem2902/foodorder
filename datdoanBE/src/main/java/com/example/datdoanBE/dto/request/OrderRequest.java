package com.example.datdoanBE.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class OrderRequest {
    private String customerName;
    private String phone;
    private String shippingAddress;
    private String paymentMethod;
    private List<CartItemDTO> items;
}