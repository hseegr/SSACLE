package ssafy.com.ssacle.sprint.dto;

import lombok.Getter;
import ssafy.com.ssacle.sprint.domain.Sprint;

@Getter
public class UserSprintResponseDTO {
    private final SprintAndCategoriesResponseDTO sprint;
    private final Long teamId;  // ✅ 사용자가 속한 팀 ID 추가

    public UserSprintResponseDTO(SprintAndCategoriesResponseDTO sprint, Long teamId) {
        this.sprint = sprint;
        this.teamId = teamId;
    }

    public static UserSprintResponseDTO from(Sprint sprint, Long teamId) {
        SprintAndCategoriesResponseDTO sprintDTO = SprintAndCategoriesResponseDTO.from(sprint);
        return new UserSprintResponseDTO(sprintDTO, teamId);
    }
}
