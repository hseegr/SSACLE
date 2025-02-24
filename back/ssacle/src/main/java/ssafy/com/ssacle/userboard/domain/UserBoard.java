package ssafy.com.ssacle.userboard.domain;

import jakarta.persistence.*;
import lombok.*;
import ssafy.com.ssacle.board.domain.Board;
import ssafy.com.ssacle.user.domain.User;

@Entity
@Table(name = "user_board")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserBoard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    public static UserBoard create(User user, Board board) {
        return UserBoard.builder()
                .user(user)
                .board(board)
                .build();
    }
}
