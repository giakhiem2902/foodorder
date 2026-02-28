package com.example.datdoanBE.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.datdoanBE.dto.response.ProductResponse;
import com.example.datdoanBE.entity.Product;
import com.example.datdoanBE.repository.ProductRepository;
import com.example.datdoanBE.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final String UPLOAD_DIR = "uploads/products/";

    @Override
    @Transactional
    public Product saveProduct(Product product, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            product.setImageUrl(saveImage(image));
        }
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, Product productRequest, MultipartFile image) {

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));

        existingProduct.setName(productRequest.getName());
        existingProduct.setPrice(productRequest.getPrice());
        existingProduct.setDescription(productRequest.getDescription());
        existingProduct.setCategory(productRequest.getCategory());

        if (image != null && !image.isEmpty()) {
            existingProduct.setImageUrl(saveImage(image));
        }

        return productRepository.save(existingProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));

        productRepository.delete(product);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ProductResponse> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));

        return mapToResponse(product);
    }

    @Override
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .build();
    }

    private String saveImage(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath,
                    StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/products/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu hình ảnh: " + e.getMessage());
        }
    }
}