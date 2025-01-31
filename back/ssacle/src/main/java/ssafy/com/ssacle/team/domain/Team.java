package ssafy.com.ssacle.team.domain;

import jakarta.persistence.*;
import lombok.*;
import ssafy.com.ssacle.user_team.domain.UserTeam;

import java.util.List;

@Entity
@Table(name = "team")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "count")
    private int count;

    @Column(name = "is_full", nullable = false)
    private boolean isFull = false;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserTeam> userTeam;

    public void increaseCount() {
        this.count++;
    }

    public void markAsFull() {
        this.isFull = true;
    }
}

