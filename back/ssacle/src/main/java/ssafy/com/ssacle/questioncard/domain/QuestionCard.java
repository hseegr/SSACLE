package ssafy.com.ssacle.questioncard.domain;

import jakarta.persistence.*;
import lombok.*;
import ssafy.com.ssacle.questioncard.exception.QuestionAlreadyViewedException;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.team.domain.Team;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuestionCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id", nullable = false)
    private Sprint sprint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(length = 512, nullable = false)
    private String description;
    public void updateDescription(String description) {
        this.description = description;
    }

    @Column(nullable = false)
    private boolean isOpened;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public QuestionCard(Sprint sprint, Team team, String description, boolean isOpened) {
        this.sprint = sprint;
        this.team = team;
        this.description = description;
        this.isOpened = isOpened;
        this.createdAt = LocalDateTime.now();
    }

    public void update(){
        if(this.isOpened){
            throw new QuestionAlreadyViewedException();
        }
        this.isOpened=true;
    }
}
