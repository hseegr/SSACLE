package ssafy.com.ssacle.ssaldcup.domain;

import java.time.LocalDateTime;

public class SsaldCupBuilder {
    private String name;
    private String description;
    private Integer maxTeams;
    private Integer maxTeamMembers;
    private LocalDateTime startAt;
    private LocalDateTime endAt;

    public static SsaldCupBuilder builder(){
        return new SsaldCupBuilder();
    }
    public SsaldCupBuilder name(String name){
        this.name=name;
        return this;
    }
    public SsaldCupBuilder description(String description){
        this.description=description;
        return this;
    }
    public SsaldCupBuilder maxTeams(Integer maxTeams){
        this.maxTeams=maxTeams;
        return this;
    }
    public SsaldCupBuilder maxTeamMembers(Integer maxTeamMembers){
        this.maxTeamMembers=maxTeamMembers;
        return this;
    }

    public SsaldCupBuilder startAt(LocalDateTime startAt){
        this.startAt=startAt;
        return this;
    }
    public SsaldCupBuilder endAt(LocalDateTime endAt){
        this.endAt=endAt;
        return this;
    }

    public SsaldCup build(){
        SsaldCup ssaldCup = new SsaldCup(name,description,maxTeams,0,maxTeamMembers,0, true,startAt,endAt,LocalDateTime.now());
        return ssaldCup;
    }
}
