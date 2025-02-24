package ssafy.com.ssacle.team.dto;

import lombok.Getter;
import ssafy.com.ssacle.team.domain.Team;

@Getter
public class TeamResponse {
    private final Long id;
    private final String name;
    private final Integer currentMembers;
    private final String notionUrl;
    private final int point;

    public TeamResponse(Team team) {
        this.id = team.getId();
        this.name = team.getName();
        this.currentMembers = team.getCurrentMembers();
        this.notionUrl = team.getNotionURL();
        this.point = team.getPoint();
    }

    public static TeamResponse from(Team team) {
        return new TeamResponse(team);
    }
}

