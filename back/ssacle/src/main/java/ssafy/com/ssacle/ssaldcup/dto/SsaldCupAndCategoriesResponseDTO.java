package ssafy.com.ssacle.ssaldcup.dto;

import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.category.dto.CategoryNameLevelImageResponseDTO;
import ssafy.com.ssacle.ssaldcup.domain.SsaldCup;
import ssafy.com.ssacle.ssaldcupcategory.domain.SsaldCupCategory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class SsaldCupAndCategoriesResponseDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private Integer maxTeams;
    private Integer currentTeams;
    private List<CategoryNameLevelImageResponseDTO> categories;

    @Builder
    public SsaldCupAndCategoriesResponseDTO(SsaldCup ssaldCup,List<CategoryNameLevelImageResponseDTO> categories){
        this.id=ssaldCup.getId();
        this.name=ssaldCup.getName();
        this.description=ssaldCup.getDescription();
        this.startAt=ssaldCup.getStartAt();
        this.endAt=ssaldCup.getEndAt();
        this.maxTeams=ssaldCup.getMaxTeams();
        this.currentTeams=ssaldCup.getCurrentTeams();
        this.categories=categories;
    }

    public static SsaldCupAndCategoriesResponseDTO from(SsaldCup ssaldCup){
        List<CategoryNameLevelImageResponseDTO> categoryDTOs = ssaldCup.getSsaldCupCategories().stream()
                .map(SsaldCupCategory::getCategory)
                .filter(category -> category.getLevel() !=3)
                .map(category -> new CategoryNameLevelImageResponseDTO(category.getCategoryName(), category.getLevel(), category.getImage()))
                .collect(Collectors.toList());
        return SsaldCupAndCategoriesResponseDTO.builder()
                .ssaldCup(ssaldCup)
                .categories(categoryDTOs)
                .build();
    }
}
