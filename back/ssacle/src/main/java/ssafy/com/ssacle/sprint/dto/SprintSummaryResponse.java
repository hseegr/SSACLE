package ssafy.com.ssacle.sprint.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.sprint.domain.Sprint;

import java.time.temporal.ChronoUnit;

@Getter
@Builder
public class SprintSummaryResponse {
    @NotBlank
    private String name;

    @NotBlank
    private String type;

    @NotBlank
    private int duration;

    public static SprintSummaryResponse of(Sprint sprint){
        return SprintSummaryResponse.builder()
                .name(sprint.getName())
                .type("싸프린트")
                .duration((int) ChronoUnit.DAYS.between(sprint.getStartAt(), sprint.getEndAt()))
                .build();
    }
}
