package com.example.datdoanBE.controller.client;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.datdoanBE.dto.request.OrderRequest;
import com.example.datdoanBE.dto.response.MessageResponse;
import com.example.datdoanBE.entity.Order;
import com.example.datdoanBE.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/client/orders")
@RequiredArgsConstructor
public class OrderClientController {

    private final OrderService orderService;
    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getMyOrderHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderDetail(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id, @RequestParam Long userId) {
        try {
            Order cancelledOrder = orderService.cancelOrder(id, userId);
            return ResponseEntity.ok(cancelledOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}