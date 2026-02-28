package com.example.datdoanBE.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.datdoanBE.entity.Product;
import com.example.datdoanBE.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class ProductAdminController {

    private final ProductService productService;
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Product> addProduct(
            @RequestPart("product") Product product,
            @RequestPart("image") MultipartFile image) {
        return ResponseEntity.ok(productService.saveProduct(product, image));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") Product product,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(productService.updateProduct(id, product, image));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}