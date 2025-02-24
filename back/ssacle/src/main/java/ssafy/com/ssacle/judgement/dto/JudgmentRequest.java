package ssafy.com.ssacle.judgement.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class JudgmentRequest {
    @NotNull
    private Long sprintId;
}