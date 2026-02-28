package com.example.datdoanBE.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.datdoanBE.dto.response.ProductResponse;
import com.example.datdoanBE.entity.Product;

public interface ProductService {

    Product saveProduct(Product product, MultipartFile image);

    Product updateProduct(Long id, Product productRequest, MultipartFile image);

    void deleteProduct(Long id);

    List<ProductResponse> getAllProducts();

    List<ProductResponse> searchProducts(String keyword);

    ProductResponse getProductById(Long id);

    List<ProductResponse> getProductsByCategory(Long categoryId);
}