package ssafy.com.ssacle.userteam.domain;

import jakarta.persistence.*;
import lombok.*;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.user.domain.User;

@Entity
@Table(name = "user_team")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserTeam {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    public UserTeam(User user, Team team){
        this.user=user;
        this.team=team;
    }
}
