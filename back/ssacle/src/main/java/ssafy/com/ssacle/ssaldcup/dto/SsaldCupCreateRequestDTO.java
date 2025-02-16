package ssafy.com.ssacle.ssaldcup.dto;

import lombok.Getter;
import ssafy.com.ssacle.sprint.dto.SprintCreateRequest;
import ssafy.com.ssacle.ssaldcupcategory.domain.SsaldCupCategory;
import ssafy.com.ssacle.team.domain.Team;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class SsaldCupCreateRequestDTO {
    private String name;
    private String description;
    private Integer maxTeams;
    private Integer maxTeamMembers;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private List<Long> categoryIds;
    private List<SprintCreateRequest> sprints;
}
