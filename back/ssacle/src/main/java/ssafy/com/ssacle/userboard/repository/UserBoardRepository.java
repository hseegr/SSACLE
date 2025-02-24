package ssafy.com.ssacle.userboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.com.ssacle.userboard.domain.UserBoard;

public interface UserBoardRepository extends JpaRepository<UserBoard, Long> {
    boolean existsByUserIdAndBoardId(Long userId, Long boardId);
}
