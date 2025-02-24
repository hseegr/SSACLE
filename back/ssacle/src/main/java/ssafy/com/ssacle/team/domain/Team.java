package ssafy.com.ssacle.team.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import ssafy.com.ssacle.diary.domain.Diary;
import ssafy.com.ssacle.global.exception.UtilErrorCode;
import ssafy.com.ssacle.global.utill.ValidationUtils;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.ssaldcup.domain.SsaldCup;
import ssafy.com.ssacle.todo.domain.Todo;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.userteam.domain.UserTeam;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="team")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Team {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<UserTeam> userTeams;

    public void addUser(User user){
        UserTeam userTeam = new UserTeam(user,this);

        if (!this.userTeams.contains(userTeam)) {
            this.userTeams.add(userTeam);
            user.addUserTeam(userTeam);
        }
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="sprint_id")
    @Setter
    @JsonIgnore
    private Sprint sprint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="ssaldcup_id")
    @Setter
    @JsonIgnore
    private SsaldCup ssaldCup;

    @OneToMany(mappedBy = "team", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Todo> todos;

    public void addTodo(Todo todo){
        if(this.todos == null)
            this.todos = new ArrayList<>();
        this.todos.add(todo);
        todo.setTeam(this);
    }

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Diary> diaries;

    @Column(name = "name", nullable = false, length = 20)
    private String name;

    @Column(name = "current_members", columnDefinition = "TINYINT UNSIGNED", nullable = false)
    private Integer currentMembers;

    @Column(name = "NotionURL")
    @Setter
    private String NotionURL;

    @Column(name = "point")
    @Setter
    private int point;

    public Team(String name, Integer currentMembers){
        ValidationUtils.validationCount(currentMembers, UtilErrorCode.MEMBER_VALIDATION_COUNT_FAILED);
        this.name=name;
        this.currentMembers = currentMembers;
        this.userTeams = new ArrayList<>();
        this.todos = new ArrayList<>();
    }

}
