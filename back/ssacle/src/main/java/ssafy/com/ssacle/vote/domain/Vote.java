package ssafy.com.ssacle.vote.domain;

import jakarta.persistence.*;
import lombok.*;
import ssafy.com.ssacle.lunch.domain.Lunch;
import ssafy.com.ssacle.user.domain.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "vote")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lunch_id", nullable = false)
    private Lunch lunch;

    @Column(nullable = false)
    private LocalDateTime voteDay;
}
