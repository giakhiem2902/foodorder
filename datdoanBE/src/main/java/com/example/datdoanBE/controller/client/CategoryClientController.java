package com.example.datdoanBE.controller.client;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.datdoanBE.entity.Category;
import com.example.datdoanBE.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/client/categories")
@RequiredArgsConstructor
public class CategoryClientController {

    private final CategoryService categoryService;
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }
}