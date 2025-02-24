package ssafy.com.ssacle.category.dto;

import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.category.domain.Category;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class CategoryTreeResponseDTO {
    private Long id;
    private String categoryName;
    private List<CategoryTreeResponseDTO> subCategories;

    public static List<CategoryTreeResponseDTO> from(List<Category> categories) {
        return categories.stream()
                .filter(category -> category.getParent() == null)
                .map(CategoryTreeResponseDTO::convertToTree)
                .collect(Collectors.toList());
    }

    private static CategoryTreeResponseDTO convertToTree(Category category) {
        return CategoryTreeResponseDTO.builder()
                .id(category.getId())
                .categoryName(category.getCategoryName())
                .subCategories(category.getChildren().stream()
                        .map(CategoryTreeResponseDTO::convertToTree)
                        .collect(Collectors.toList()))
                .build();
    }
}
