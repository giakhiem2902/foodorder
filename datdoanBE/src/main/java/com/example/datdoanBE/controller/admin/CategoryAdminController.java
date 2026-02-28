package com.example.datdoanBE.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.datdoanBE.dto.response.MessageResponse;
import com.example.datdoanBE.entity.Category;
import com.example.datdoanBE.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class CategoryAdminController {

    private final CategoryService categoryService;
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Category> createCategory(
            @RequestPart("category") Category category,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(categoryService.createCategory(category, image));
    }
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @RequestPart("category") Category category,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category, image));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(new MessageResponse("Đã xóa danh mục thành công."));
    }
}