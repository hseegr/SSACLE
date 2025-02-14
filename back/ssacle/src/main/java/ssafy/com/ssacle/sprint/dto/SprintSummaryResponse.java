package ssafy.com.ssacle.sprint.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.sprint.domain.Sprint;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Getter
@Builder
public class SprintSummaryResponse {
    @NotBlank
    private Long id;
    @NotBlank
    private String name;

    @NotBlank
    private String type;

    @NotBlank
    private int duration;

    @NotBlank
    private LocalDateTime endAt;

    public static SprintSummaryResponse of(Sprint sprint){
        return SprintSummaryResponse.builder()
                .id(sprint.getId())
                .name(sprint.getName())
                .type("싸프린트")
                .duration((int) ChronoUnit.DAYS.between(sprint.getStartAt(), sprint.getEndAt()))
                .endAt(sprint.getEndAt())
                .build();
    }
}
