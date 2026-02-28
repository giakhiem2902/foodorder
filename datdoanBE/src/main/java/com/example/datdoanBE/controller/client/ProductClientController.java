package com.example.datdoanBE.controller.client;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.datdoanBE.dto.response.ProductResponse;
import com.example.datdoanBE.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/client/products")
@RequiredArgsConstructor
public class ProductClientController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductDetail(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
}