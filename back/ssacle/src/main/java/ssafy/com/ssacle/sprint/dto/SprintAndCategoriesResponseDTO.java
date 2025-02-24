package ssafy.com.ssacle.sprint.dto;

import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.category.dto.CategoryNameLevelImageResponseDTO;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.SprintCategory.domain.SprintCategory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class SprintAndCategoriesResponseDTO {
    private Long id;
    private String name;
    private String basicDescription;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private Integer maxMembers;
    private Integer currentMembers;
    private List<CategoryNameLevelImageResponseDTO> categories;

    @Builder
    public SprintAndCategoriesResponseDTO(Sprint sprint, List<CategoryNameLevelImageResponseDTO> categories) {
        this.id = sprint.getId();
        this.name = sprint.getName();
        this.basicDescription = sprint.getBasicDescription();
        this.startAt = sprint.getStartAt();
        this.endAt = sprint.getEndAt();
        this.maxMembers = sprint.getMaxMembers();
        this.currentMembers = sprint.getCurrentMembers();
        this.categories = categories;
    }

    public static SprintAndCategoriesResponseDTO from(Sprint sprint) {
        List<CategoryNameLevelImageResponseDTO> categoryDTOs = sprint.getSprintCategories().stream()
                .map(SprintCategory::getCategory)
                .filter(category -> category.getLevel() != 3)
                .distinct()
                .map(category -> new CategoryNameLevelImageResponseDTO(category.getCategoryName(), category.getLevel(), category.getImage()))
                .collect(Collectors.toList());

        return SprintAndCategoriesResponseDTO.builder()
                .sprint(sprint)
                .categories(categoryDTOs)
                .build();
    }
}
