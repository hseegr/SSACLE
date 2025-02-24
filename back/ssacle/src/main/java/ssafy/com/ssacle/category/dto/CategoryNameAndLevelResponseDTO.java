package ssafy.com.ssacle.category.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryNameAndLevelResponseDTO {
    private String categoryName;
    private Integer categoryLevel;
}
