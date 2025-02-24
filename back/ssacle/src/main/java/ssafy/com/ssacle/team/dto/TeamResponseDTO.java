package ssafy.com.ssacle.team.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import ssafy.com.ssacle.team.domain.Team;

@Getter
@RequiredArgsConstructor
public class TeamResponseDTO {
    private final String name;
    private final String notionURL;

    public static TeamResponseDTO from(Team team) {
        return new TeamResponseDTO("팀 "+team.getName()+" 의 노트", team.getNotionURL());
    }
}
