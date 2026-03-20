package com.example.datdoanBE.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.example.datdoanBE.entity.enums.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderAdminDTO {
    private Long id;
    private String customerName;
    private String phone;
    private String shippingAddress;
    private Double totalPrice;
    private OrderStatus status;
    private String paymentMethod;
    private LocalDateTime createdAt;
    
    // User info (minimal to avoid circular reference)
    private Long userId;
    private String username;
    private String userFullName;
    
    // Items count (lightweight)
    private Integer itemsCount;
    private List<OrderItemDTO> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemDTO {
        private Long id;
        private Integer quantity;
        private Double priceAtPurchase;
        private Long productId;
        private String productName;
    }
}
