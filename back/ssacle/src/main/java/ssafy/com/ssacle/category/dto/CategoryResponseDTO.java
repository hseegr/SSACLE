package ssafy.com.ssacle.category.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import ssafy.com.ssacle.category.domain.Category;

@Getter
@Setter
@Builder
public class CategoryResponseDTO {
    @NotBlank
    private String categoryName;

    @NotBlank
    private String image;

    public static CategoryResponseDTO from(Category category){
        return CategoryResponseDTO.builder()
                .categoryName(category.getCategoryName())
                .image(category.getImage())
            .build();
    }
}
