package ssafy.com.ssacle.category.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ssafy.com.ssacle.category.dto.CategoryCreateRequest;
import ssafy.com.ssacle.category.dto.CategoryResponseDTO;
import ssafy.com.ssacle.category.dto.CategoryTreeResponseDTO;
import ssafy.com.ssacle.category.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
@RequiredArgsConstructor
public class CategoryController implements CategorySwaggerController {
    private final CategoryService categoryService;

//    @Override
//    public ResponseEntity<CategoryResponseDTO> createCategory(String param1, String param2, String param3, CategoryCreateRequest request) {
//        return ResponseEntity.status(201).body(categoryService.createCategory(param1, param2, param3, request.getImage()));
//    }

    @Override
    public ResponseEntity<CategoryResponseDTO> createCategory(String param1, String param2, String param3, MultipartFile image) {
        return ResponseEntity.status(201).body(categoryService.createCategory(param1, param2, param3, image));
    }

    @Override
    public ResponseEntity<List<CategoryTreeResponseDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryService.findAllCategories());
    }

    @Override
    public ResponseEntity<List<CategoryResponseDTO>> getParentCategories() {
        return ResponseEntity.ok(categoryService.findParentCategories());
    }

    @Override
    public ResponseEntity<List<CategoryResponseDTO>> getSubCategories(@PathVariable Long parentId) {
        return ResponseEntity.ok(categoryService.findSubCategories(parentId));
    }
}
