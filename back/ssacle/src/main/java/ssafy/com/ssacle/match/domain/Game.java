package ssafy.com.ssacle.match.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import ssafy.com.ssacle.ssaldcup.domain.SsaldCup;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "game")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 경기 ID (Primary Key)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ssaldcup_id", nullable = false)
    private SsaldCup ssaldCup;  // 해당 매치가 속한 SsaldCup

    @Column(name = "week", nullable = false)
    private Integer week; // 몇 주차 경기인지 저장

    @Column(nullable = false, length = 100)
    private String teamMatchKey; // "1_2" 형식으로 저장

    @Column(name = "match_date")
    private LocalDateTime matchDate; // 경기 날짜

    public static String generateMatchKey(Long team1, Long team2) {
        return team1 < team2 ? team1 + "_" + team2 : team2 + "_" + team1;
    }

    public void setTeamMatchKey(Long team1, Long team2) {
        this.teamMatchKey = generateMatchKey(team1, team2);
    }
}
