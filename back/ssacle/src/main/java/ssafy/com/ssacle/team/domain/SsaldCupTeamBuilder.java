package ssafy.com.ssacle.team.domain;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import ssafy.com.ssacle.ssaldcup.domain.SsaldCup;
import ssafy.com.ssacle.ssaldcup.exception.SsaldCupRequiredException;
import ssafy.com.ssacle.team.exception.UserRequiredException;
import ssafy.com.ssacle.user.domain.User;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SsaldCupTeamBuilder {
    private SsaldCup ssaldCup;
    private User user;

   // private String teamName;

    public static SsaldCupTeamBuilder builder(){
        return new SsaldCupTeamBuilder();
    }

    public SsaldCupTeamBuilder addUser(User user){
        this.user=user;
        return this;
    }

//    public SsaldCupTeamBuilder withName(String teamName) {  // 팀 이름 설정 메서드
//        this.teamName = teamName;
//        return this;
//    }

    public SsaldCupTeamBuilder participateSsaldCup(SsaldCup ssaldCup){
        this.ssaldCup=ssaldCup;
        return this;
    }

    public Team build(){
        if(user == null)
            throw new UserRequiredException();
        if(ssaldCup==null)
            throw new SsaldCupRequiredException();

//        if (teamName == null || teamName.isBlank()) {
//            throw new IllegalArgumentException("Team name must be provided.");
//        }

        Team team = new Team(user.getName(), 1);
        team.addUser(user);
        ssaldCup.addTeam(team);

        return team;
    }
}
