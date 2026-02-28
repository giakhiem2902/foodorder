package com.example.datdoanBE.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.datdoanBE.entity.Category;

public interface CategoryService {
    Category createCategory(Category category, MultipartFile image);
    
    Category updateCategory(Long id, Category category, MultipartFile image);

    void deleteCategory(Long id);

    List<Category> getAllCategories();
    
    Category getCategoryById(Long id);
}