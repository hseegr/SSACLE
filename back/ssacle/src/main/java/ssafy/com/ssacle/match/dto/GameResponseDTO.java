package ssafy.com.ssacle.match.dto;

import jakarta.validation.constraints.NotBlank;
import ssafy.com.ssacle.team.dto.TeamResponse;

import java.util.List;

public class GameResponseDTO {
    @NotBlank
    private int week;

    @NotBlank
    private String topic;

    @NotBlank
    private List<TeamResponse> teams;
}
