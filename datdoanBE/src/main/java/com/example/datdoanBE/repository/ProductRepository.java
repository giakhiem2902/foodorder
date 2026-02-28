package com.example.datdoanBE.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.datdoanBE.entity.Category;
import com.example.datdoanBE.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category category);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByCategoryId(Long categoryId);
    long countByCategoryId(Long categoryId);
}