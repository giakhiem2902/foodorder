package com.example.datdoanBE.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.datdoanBE.dto.request.OrderRequest;
import com.example.datdoanBE.dto.response.MessageResponse;
import com.example.datdoanBE.entity.Order;
import com.example.datdoanBE.entity.OrderItem;
import com.example.datdoanBE.entity.Product;
import com.example.datdoanBE.entity.User;
import com.example.datdoanBE.entity.enums.OrderStatus;
import com.example.datdoanBE.repository.OrderRepository;
import com.example.datdoanBE.repository.ProductRepository;
import com.example.datdoanBE.repository.UserRepository;
import com.example.datdoanBE.service.OrderService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

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

        // Nếu có user đang xác thực, gán về đơn hàng
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal != null && principal instanceof com.example.datdoanBE.security.services.UserDetailsImpl) {
                Long userId = ((com.example.datdoanBE.security.services.UserDetailsImpl) principal).getId();
                User user = userRepository.findById(userId).orElse(null);
                order.setUser(user);
            }
        } catch (Exception e) {
            // ignore - allow anonymous orders if needed
        }

        // Xử lý từng item: lấy product, tạo OrderItem, tính tổng
        List<OrderItem> items = new ArrayList<>();
        double total = 0.0;
        if (request.getItems() != null) {
            for (Object obj : request.getItems()) {
                Long productId = null;
                Integer quantity = 0;

                // Try to read getters (for typed DTOs)
                try {
                    java.lang.reflect.Method mPid = obj.getClass().getMethod("getProductId");
                    Object pid = mPid.invoke(obj);
                    if (pid instanceof Integer) productId = ((Integer) pid).longValue();
                    else if (pid instanceof Long) productId = (Long) pid;

                    java.lang.reflect.Method mQty = obj.getClass().getMethod("getQuantity");
                    Object q = mQty.invoke(obj);
                    if (q instanceof Integer) quantity = (Integer) q;
                    else if (q instanceof Long) quantity = ((Long) q).intValue();
                } catch (NoSuchMethodException e) {
                    // Might be a Map (Jackson deserialized)
                    if (obj instanceof java.util.Map) {
                        java.util.Map map = (java.util.Map) obj;
                        Object pid = map.get("productId");
                        if (pid instanceof Integer) productId = ((Integer) pid).longValue();
                        else if (pid instanceof Long) productId = (Long) pid;
                        Object q = map.get("quantity");
                        if (q instanceof Integer) quantity = (Integer) q;
                        else if (q instanceof Long) quantity = ((Long) q).intValue();
                    } else {
                        throw new RuntimeException("Không thể đọc thông tin item đơn hàng");
                    }
                } catch (Exception e) {
                    throw new RuntimeException("Lỗi đọc item đơn hàng: " + e.getMessage());
                }

        if (productId == null) {
                    throw new RuntimeException("productId không hợp lệ trong item đơn hàng");
                }

        final Long pidForLookup = productId;
        Product product = productRepository.findById(pidForLookup)
            .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại: " + pidForLookup));

                OrderItem oi = OrderItem.builder()
                        .order(order)
                        .product(product)
                        .quantity(quantity)
                        .priceAtPurchase(product.getPrice())
                        .build();

                items.add(oi);
                total += product.getPrice() * (quantity != null ? quantity : 0);
            }
        }

        order.setItems(items);
        order.setTotalPrice(total);

        // Save order (cascade will persist items)
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
        Double revenue = orderRepository.calculateRevenueBetween(OrderStatus.COMPLETED, start, end);
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