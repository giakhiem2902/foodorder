package com.example.datdoanBE.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.datdoanBE.entity.Order;
import com.example.datdoanBE.entity.enums.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    //Lịch sử đơn hàng(id)
    List<Order> findAllByUserIdOrderByCreatedAtDesc(Long userId);
    //Lịch sử đơn hàng(all)
    List<Order> findAllByOrderByCreatedAtDesc();
    //Thống kê doanh thu theo trạng thái đơn hàng và khoảng thời gian
    @Query("SELECT SUM(o.totalPrice) FROM Order o " +
           "WHERE o.status = :status " +
           "AND o.createdAt BETWEEN :startDate AND :endDate")
    Double calculateRevenueBetween(
            @Param("status") OrderStatus status,
            @Param("startDate") LocalDateTime startDate, 
            @Param("endDate") LocalDateTime endDate);
    // Đếm số lượng đơn hàng theo trạng thái
    long countByStatus(OrderStatus status);
    //Tìm kiếm
    List<Order> findByPhoneContainingOrCustomerNameContainingIgnoreCase(String phone, String fullname);
}