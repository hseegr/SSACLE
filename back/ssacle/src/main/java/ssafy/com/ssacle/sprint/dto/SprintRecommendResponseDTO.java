package ssafy.com.ssacle.sprint.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.sprint.domain.Sprint;

import java.time.LocalDate;

@Getter
@Builder
public class SprintRecommendResponseDTO {
    @NotBlank
    private Long id;

    @NotBlank
    private String majorCategoryName;

    @NotBlank
    private String subCategoryName;

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private LocalDate start_at;

    @NotBlank
    private LocalDate end_at;

    @NotBlank
    private int currentMembers;

    @NotBlank
    private int maxMembers;

    @NotBlank
    private String imageUrl;


}
