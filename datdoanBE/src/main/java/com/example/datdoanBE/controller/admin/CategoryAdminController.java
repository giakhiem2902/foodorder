package com.example.datdoanBE.controller.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, 
             allowedHeaders = "*",
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class CategoryAdminController {

    private final CategoryService categoryService;
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Category> createCategory(
            @RequestParam(value = "name") String name,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        Category category = new Category();
        category.setName(name);
        return ResponseEntity.ok(categoryService.createCategory(category, image));
    }
    @PutMapping(value = "/{id}", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @RequestParam(value = "name") String name,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        Category category = new Category();
        category.setName(name);
        return ResponseEntity.ok(categoryService.updateCategory(id, category, image));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(new MessageResponse("Đã xóa danh mục thành công."));
    }
}