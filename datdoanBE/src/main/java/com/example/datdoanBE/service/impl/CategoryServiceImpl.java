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

import com.example.datdoanBE.entity.Category;
import com.example.datdoanBE.repository.CategoryRepository;
import com.example.datdoanBE.repository.ProductRepository;
import com.example.datdoanBE.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final String UPLOAD_DIR = "uploads/categories/";

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));
    }

    @Override
    @Transactional
    public Category createCategory(Category category, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            category.setImageUrl(saveImage(image));
        }
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public Category updateCategory(Long id, Category categoryRequest, MultipartFile image) {
        Category category = getCategoryById(id);
        category.setName(categoryRequest.getName());
        
        if (image != null && !image.isEmpty()) {
            category.setImageUrl(saveImage(image));
        }
        
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục!"));
        
        long productCount = productRepository.countByCategoryId(id);
        if (productCount > 0) {
            throw new RuntimeException("Không thể xóa! Danh mục này đang chứa " + productCount + " món ăn.");
        }
        
        categoryRepository.delete(category);
    }

    private String saveImage(MultipartFile file) {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Files.copy(file.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            return "/" + UPLOAD_DIR + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Lỗi lưu file ảnh: " + e.getMessage());
        }
    }
}