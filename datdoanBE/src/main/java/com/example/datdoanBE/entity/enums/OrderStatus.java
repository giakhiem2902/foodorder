package com.example.datdoanBE.entity.enums;

public enum OrderStatus {
    PENDING,    // Chờ xác nhận
    PREPARING,  // Đang chuẩn bị
    SHIPPING,   // Đang giao
    COMPLETED,  // Hoàn thành
    CANCELLED   // Đã hủy
}
