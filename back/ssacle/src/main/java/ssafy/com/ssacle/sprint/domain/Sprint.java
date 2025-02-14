package ssafy.com.ssacle.sprint.domain;

import jakarta.persistence.*;
import lombok.*;
import ssafy.com.ssacle.SprintCategory.domain.SprintCategory;
import ssafy.com.ssacle.category.domain.Category;
import ssafy.com.ssacle.global.exception.UtilErrorCode;
import ssafy.com.ssacle.global.utill.ValidationUtils;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.todo.domain.DefaultTodo;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sprint")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Sprint {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "sprint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SprintCategory> sprintCategories;

    @OneToMany(mappedBy = "sprint")
    private List<Team> teams;

    @OneToMany(mappedBy = "sprint", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<DefaultTodo> defaultTodos;

    public void addDefaultTodo(DefaultTodo defaultTodo){
        defaultTodo.setSprint(this);
        this.defaultTodos.add(defaultTodo);
    }

    @Column(name = "name", nullable = false, length=255)
    private String name;

    @Column(name = "basic_description", nullable = false, length=100)
    private String basicDescription;

    @Column(name = "detail_description", nullable = false)
    private String detailDescription;

    @Column(name = "recommended_for", nullable = false)
    private String recommendedFor;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at", nullable = false)
    private LocalDateTime endAt;

    @Column(name = "announce_at", nullable = false)
    private LocalDateTime announceAt;

    @Setter
    @Column(name = "status", columnDefinition = "TINYINT UNSIGNED", nullable = false)
    private Integer status;

    @Column(name = "sequence", columnDefinition = "TINYINT UNSIGNED", nullable = false)
    private Integer sequence;

    @Column(name = "max_members", columnDefinition = "TINYINT UNSIGNED", nullable = false)
    private Integer maxMembers;

    @Column(name = "current_members", columnDefinition = "TINYINT UNSIGNED", nullable = false)
    private Integer currentMembers;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected Sprint(String name, String basicDescription, String detailDescription, String recommendedFor, LocalDateTime startAt, LocalDateTime endAt, LocalDateTime announceAt, Integer status, Integer sequence, Integer maxMembers, Integer currentMembers, LocalDateTime createdAt){
        ValidationUtils.validationCount(status, UtilErrorCode.STATUS_VALIDATION_COUNT_FAILED);
        ValidationUtils.validationCount(sequence, UtilErrorCode.SEQUENCE_VALIDATION_COUNT_FAILED);
        ValidationUtils.validationCount(maxMembers, UtilErrorCode.MEMBER_VALIDATION_COUNT_FAILED);
        ValidationUtils.validationCount(currentMembers, UtilErrorCode.MEMBER_VALIDATION_COUNT_FAILED);

        this.name=name;
        this.basicDescription=basicDescription;
        this.detailDescription=detailDescription;
        this.recommendedFor=recommendedFor;
        this.startAt=startAt;
        this.endAt=endAt;
        this.announceAt=announceAt;
        this.status=status;
        this.sequence=sequence;
        this.maxMembers=maxMembers;
        this.currentMembers=currentMembers;
        this.createdAt=createdAt;
        this.teams = new ArrayList<>();
        this.defaultTodos = new ArrayList<>();
        this.sprintCategories = new ArrayList<>();
    }

    public void addTeam(Team team){
        this.teams.add(team);
        team.setSprint(this);
    }

    public void addCategory(Category category) {
        this.sprintCategories.add(new SprintCategory(this, category));
    }

}
