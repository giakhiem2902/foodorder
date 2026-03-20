package com.example.datdoanBE.service;

import java.time.LocalDateTime;
import java.util.List;

import com.example.datdoanBE.dto.request.OrderRequest;
import com.example.datdoanBE.dto.response.OrderAdminDTO;
import com.example.datdoanBE.entity.Order;
import com.example.datdoanBE.entity.enums.OrderStatus;

public interface OrderService {
    Order getOrderById(Long id);
    Order createOrder(OrderRequest request);
    Order updateOrderStatus(Long orderId, OrderStatus newStatus);
    List<Order> getAllOrders();
    List<OrderAdminDTO> getAllOrdersDTO(); // ← New method to return DTO (no circular refs)
    List<Order> getOrdersByUserId(Long userId);
    Order cancelOrder(Long orderId, Long userId);
    Double getRevenueReport(LocalDateTime start, LocalDateTime end);
    long countOrdersByStatus(OrderStatus status);
    void deleteOrder(Long id);
}