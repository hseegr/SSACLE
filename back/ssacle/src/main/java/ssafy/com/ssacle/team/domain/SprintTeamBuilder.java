package ssafy.com.ssacle.team.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.sprint.exception.SprintRequiredException;
import ssafy.com.ssacle.team.exception.TeamNameRequiredException;
import ssafy.com.ssacle.team.exception.UserRequiredException;
import ssafy.com.ssacle.user.domain.User;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SprintTeamBuilder {
    private Sprint sprint;
    private User user;
    private String teamName;

    public static SprintTeamBuilder builder(){
        return new SprintTeamBuilder();
    }

    public SprintTeamBuilder addUser(User user){
        this.user=user;
        return this;
    }

    public SprintTeamBuilder participateSprint(Sprint sprint){
        this.sprint=sprint;
        return this;
    }

    public SprintTeamBuilder teamName(String teamName){
        this.teamName=teamName;
        return this;
    }

    public Team build(){
        if(user == null)
            throw new UserRequiredException();
        if(sprint == null)
            throw new SprintRequiredException();
        if(teamName == null || teamName.isEmpty())
            throw new TeamNameRequiredException();

        Team team = new Team(teamName,1);
        team.addUser(user);
        sprint.addTeam(team);

        return team;
    }
}
