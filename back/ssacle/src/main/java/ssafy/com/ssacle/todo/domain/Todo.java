package ssafy.com.ssacle.todo.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import ssafy.com.ssacle.team.domain.Team;

import java.time.LocalDate;

@Entity
@Table(name = "todo")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class Todo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="team_id")
    @JsonIgnore
    @Setter
    private Team team;

    @Column(name="content", nullable = false, length = 1024)
    private String content;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Setter
    @Column(name = "is_done", nullable = false)
    private boolean isDone;
}
