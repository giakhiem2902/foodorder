package com.example.datdoanBE.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.datdoanBE.dto.request.OrderRequest;
import com.example.datdoanBE.dto.response.MessageResponse;
import com.example.datdoanBE.entity.Order;
import com.example.datdoanBE.entity.enums.OrderStatus;
import com.example.datdoanBE.repository.OrderRepository;
import com.example.datdoanBE.service.OrderService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final SimpMessagingTemplate messagingTemplate;
    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với mã ID: " + id));
    }
    @Override
    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = Order.builder()
                .customerName(request.getCustomerName())
                .phone(request.getPhone())
                .shippingAddress(request.getShippingAddress())
                .paymentMethod(request.getPaymentMethod())
                .status(OrderStatus.PENDING)
                .build();
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng!"));
        
        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        messagingTemplate.convertAndSend("/topic/order/" + orderId, 
            new MessageResponse("Đơn hàng đã chuyển sang: " + newStatus));

        return updatedOrder;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId); 
    }
    @Override
    @Transactional
    public Order cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng!"));
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền hủy đơn hàng này!");
        }
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Đơn hàng đã được xử lý, không thể hủy!");
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);
        messagingTemplate.convertAndSend("/topic/admin/orders", 
            new MessageResponse("Đơn hàng #" + orderId + " đã bị khách hủy."));

        return updatedOrder;
    }
    @Override
    public Double getRevenueReport(LocalDateTime start, LocalDateTime end) {
        Double revenue = orderRepository.calculateRevenueBetween(
                OrderStatus.COMPLETED, 
                start, 
                end
        );
        return revenue != null ? revenue : 0.0;
    }
    @Override
    public long countOrdersByStatus(OrderStatus status) {
        return orderRepository.countByStatus(status);
    }
    @Override
    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + id));
        orderRepository.delete(order);
    }
}