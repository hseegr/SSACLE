package ssafy.com.ssacle.category.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.com.ssacle.category.domain.Category;
import ssafy.com.ssacle.category.dto.CategoryNameAndLevelResponseDTO;
import ssafy.com.ssacle.category.dto.CategoryResponseDTO;
import ssafy.com.ssacle.category.dto.CategoryTreeResponseDTO;
import ssafy.com.ssacle.category.exception.CategoryNotExistException;
import ssafy.com.ssacle.category.exception.MiddleCategoryNotFoundException;
import ssafy.com.ssacle.category.exception.TopCategoryNotFoundException;
import ssafy.com.ssacle.category.repository.CategoryRepository;
import ssafy.com.ssacle.global.aws.S3ImageUploader;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final S3ImageUploader s3ImageUploader;

    public CategoryResponseDTO createCategory(String param1, String param2, String param3, MultipartFile image) {
        Category parentCategory = null;

        if (param1 != null && param2 == null) {
            return saveCategory(param1, parentCategory, null, 1);
        }

        parentCategory = categoryRepository.findByCategoryName(param1)
                .orElseThrow(TopCategoryNotFoundException::new);
        if (param2 != null && param3 == null) {
            if (image != null && !image.isEmpty()) {
                String profileUrl = s3ImageUploader.uploadCategory(image);
                return saveCategory(param2, parentCategory, profileUrl,2);
            }
            return saveCategory(param2, parentCategory, null, 2);
        }

        parentCategory = categoryRepository.findByCategoryName(param2)
                .orElseThrow(MiddleCategoryNotFoundException::new);
        if (param3 != null) {
            return saveCategory(param3, parentCategory, null,3);
        }

        throw new CategoryNotExistException();
    }

    public List<CategoryTreeResponseDTO> findAllCategories() {
        return CategoryTreeResponseDTO.from(categoryRepository.findAll());
    }

    public List<CategoryResponseDTO> findParentCategories() {
        return categoryRepository.findByParentIsNull()
                .stream()
                .map(CategoryResponseDTO::from)
                .collect(Collectors.toList());
    }

    public List<CategoryResponseDTO> findSubCategories(Long parentId) {
        return categoryRepository.findByParentId(parentId)
                .stream()
                .map(CategoryResponseDTO::from)
                .collect(Collectors.toList());
    }

    private CategoryResponseDTO saveCategory(String categoryName, Category parent, String image, Integer level) {
        Category newCategory = new Category(
                null,
                parent,
                null,
                null,
                categoryName,
                level,
                image
        );

        Category savedCategory = categoryRepository.save(newCategory);
        return CategoryResponseDTO.from(savedCategory);
    }

}
