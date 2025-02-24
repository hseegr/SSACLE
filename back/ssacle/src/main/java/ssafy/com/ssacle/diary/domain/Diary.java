package ssafy.com.ssacle.diary.domain;

import jakarta.persistence.*;
import lombok.*;
import ssafy.com.ssacle.team.domain.Team;

import java.time.LocalDate;

@Entity
@Table(name = "diary")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Diary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(name = "title", length = 50)
    private String title;

    @Column(name = "content", length = 1024)
    private String content;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    public Diary(Team team, String title, String content, LocalDate date) {
        this.team = team;
        this.title = title;
        this.content = content;
        this.date = date;
    }
}
