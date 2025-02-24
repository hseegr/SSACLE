package ssafy.com.ssacle.team.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import ssafy.com.ssacle.team.domain.Team;

import java.util.List;

@Getter
@AllArgsConstructor
public class TeamWinnerResponseDTO {
    private Long teamId;
    private String teamName;
    private Integer point;
    private List<String> memberEmails;

    public static TeamWinnerResponseDTO fromEntity(Team team) {
        List<String> emails = team.getUserTeams().stream()
                .map(userTeam -> userTeam.getUser().getEmail())
                .toList();

        return new TeamWinnerResponseDTO(team.getId(), team.getName(), team.getPoint(), emails);
    }
}

