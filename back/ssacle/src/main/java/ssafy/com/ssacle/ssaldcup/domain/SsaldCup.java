package ssafy.com.ssacle.ssaldcup.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ssafy.com.ssacle.category.domain.Category;
import ssafy.com.ssacle.global.exception.UtilErrorCode;
import ssafy.com.ssacle.global.utill.ValidationUtils;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.ssaldcupcategory.domain.SsaldCupCategory;
import ssafy.com.ssacle.team.domain.Team;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ssaldcup")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SsaldCup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "ssaldCup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sprint> sprints;

    @OneToMany(mappedBy = "ssaldCup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SsaldCupCategory> ssaldCupCategories;

    @OneToMany(mappedBy = "ssaldCup")
    private List<Team> teams;

    @Column(name = "name", nullable = false, length=255)
    private String name;

    @Column(name = "basic_description", nullable = false, length=100)
    private String basicDescription;

    @Column(name = "detail_description", nullable = false)
    private String detailDescription;

    @Column(name = "max_teams", columnDefinition = "TINYINT UNSIGNED", nullable = false)
    private Integer maxTeams;

    @Column(name = "current_teams", columnDefinition = "TINYINT UNSIGNED", nullable = false)
    private Integer currentTeams;

    @Column(name = "max_team_members", columnDefinition = "TINYINT UNSIGNED", nullable = false)
    private Integer maxTeamMembers;

    @Column(name = "status", columnDefinition = "TINYINT UNSIGNED", nullable = false)
    private Integer status;

    @Column(name = "is_process", nullable = false)
    private Boolean isProcess;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at", nullable = false)
    private LocalDateTime endAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected  SsaldCup(String name, String basicDescription, String detailDescription, Integer maxTeams, Integer currentTeams, Integer maxTeamMembers, Integer status, Boolean isProcess, LocalDateTime startAt, LocalDateTime endAt,LocalDateTime createdAt){
        ValidationUtils.validationCount(status, UtilErrorCode.STATUS_VALIDATION_COUNT_FAILED);
        ValidationUtils.validationCount(maxTeams, UtilErrorCode.TEAM_VALIDATION_COUNT_FAILED);
        ValidationUtils.validationCount(currentTeams, UtilErrorCode.TEAM_VALIDATION_COUNT_FAILED);
        ValidationUtils.validationCount(maxTeamMembers, UtilErrorCode.MEMBER_VALIDATION_COUNT_FAILED);
        this.name=name;
        this.basicDescription=basicDescription;
        this.detailDescription=detailDescription;
        this.maxTeams=maxTeams;
        this.currentTeams=currentTeams;
        this.maxTeamMembers=maxTeamMembers;
        this.status=status;
        this.isProcess=isProcess;
        this.startAt=startAt;
        this.endAt=endAt;
        this.createdAt=createdAt;
        this.ssaldCupCategories = new ArrayList<>();
        this.teams = new ArrayList<>();
    }

    public void addTeam(Team team){
        this.teams.add(team);
        team.setSsaldCup(this);
    }

    public void addCategory(Category category){
        this.ssaldCupCategories.add(new SsaldCupCategory(this, category));
    }
}
