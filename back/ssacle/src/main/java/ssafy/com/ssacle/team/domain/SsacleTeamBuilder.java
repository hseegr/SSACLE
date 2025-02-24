package ssafy.com.ssacle.team.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.sprint.exception.SprintRequiredException;
import ssafy.com.ssacle.team.exception.TeamNameRequiredException;
import ssafy.com.ssacle.team.exception.UserRequiredException;
import ssafy.com.ssacle.user.domain.User;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SsacleTeamBuilder {
    private Sprint sprint;
    private User user;
    private String teamName;

    public static SsacleTeamBuilder builder(){
        return new SsacleTeamBuilder();
    }

    public SsacleTeamBuilder addUser(User user){
        this.user=user;
        return this;
    }

    public SsacleTeamBuilder participateSprint(Sprint sprint){
        this.sprint=sprint;
        return this;
    }

    public SsacleTeamBuilder addTeamName(String teamName){
        this.teamName=teamName;
        return this;
    }

    public Team build(){
        if(teamName == null)
            throw new TeamNameRequiredException();
        if(user == null)
            throw new UserRequiredException();
        if(sprint == null)
            throw new SprintRequiredException();

        Team team = new Team(teamName,1);
        team.addUser(user);
        sprint.addTeam(team);

        return team;
    }
}
