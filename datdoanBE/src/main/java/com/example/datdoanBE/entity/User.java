package com.example.datdoanBE.entity;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String fullName;
    private String email;
    private String phone;
    private String address;

    // Chuyển từ ElementCollection sang ManyToMany để kết nối với bảng roles riêng biệt
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles", 
               joinColumns = @JoinColumn(name = "user_id"), 
               inverseJoinColumns = @JoinColumn(name = "role_id"))
    @JsonIgnore  // ← Tránh serialize roles trong entity này
    private Set<Role> roles = new HashSet<>();
}