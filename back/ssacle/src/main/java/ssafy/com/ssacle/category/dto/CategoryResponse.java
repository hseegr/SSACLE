package ssafy.com.ssacle.category.dto;

import lombok.Getter;
import lombok.Setter;
import ssafy.com.ssacle.category.domain.Category;

@Getter
@Setter
public class CategoryResponse {
    private Long id;
    private String categoryName;
    private String image;

    public CategoryResponse(Category category) {
        this.id = category.getId();
        this.categoryName = category.getCategoryName();
        this.image = category.getImage();
    }

    public static CategoryResponse from(Category category) {
        return new CategoryResponse(category);
    }
}
