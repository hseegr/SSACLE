package ssafy.com.ssacle.judgement.domain;

import jakarta.persistence.*;
import lombok.*;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.user.domain.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "Judgment", uniqueConstraints = @UniqueConstraint(columnNames = "sprint_id"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Judgment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id", nullable = false)
    private Sprint sprint;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public Judgment(User user, Sprint sprint) {
        this.user = user;
        this.sprint = sprint;
        this.createdAt = LocalDateTime.now();
    }
}
