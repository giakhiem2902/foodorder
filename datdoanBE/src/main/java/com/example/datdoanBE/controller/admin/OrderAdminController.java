package com.example.datdoanBE.controller.admin;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.datdoanBE.dto.response.MessageResponse;
import com.example.datdoanBE.dto.response.OrderAdminDTO;
import com.example.datdoanBE.entity.Order;
import com.example.datdoanBE.entity.enums.OrderStatus;
import com.example.datdoanBE.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, 
             allowedHeaders = "*",
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class OrderAdminController {
    private final OrderService orderService;
    private final SimpMessagingTemplate messagingTemplate;
    @GetMapping
    public ResponseEntity<List<OrderAdminDTO>> getAllOrders() {
        List<OrderAdminDTO> orders = orderService.getAllOrdersDTO();
        return ResponseEntity.ok(orders);
    }
    @PatchMapping("/{id}/status")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, 
                 allowedHeaders = "*",
                 methods = {RequestMethod.PATCH, RequestMethod.OPTIONS})
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long id, 
            @RequestParam OrderStatus status) {
                
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        messagingTemplate.convertAndSend("/topic/orders", updatedOrder.getStatus());
        return ResponseEntity.ok(updatedOrder);
    }

    @PutMapping("/{id}/status")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, 
                 allowedHeaders = "*",
                 methods = {RequestMethod.PUT, RequestMethod.OPTIONS})
    public ResponseEntity<Order> updateStatusPut(
            @PathVariable Long id, 
            @RequestParam OrderStatus status) {
                
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        messagingTemplate.convertAndSend("/topic/orders", updatedOrder.getStatus());
        return ResponseEntity.ok(updatedOrder);
    }
    @GetMapping("/revenue")
    public ResponseEntity<Double> getRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(orderService.getRevenueReport(start, end));
    }
    @GetMapping("/count")
    public ResponseEntity<Long> countOrdersByStatus(@RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.countOrdersByStatus(status));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(new MessageResponse("Đã xóa đơn hàng #" + id + " thành công."));
    }
}