package ssafy.com.ssacle.ainews.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.com.ssacle.ainews.domain.AINews;

import java.time.LocalDateTime;
import java.util.List;

public interface AINewsRepository extends JpaRepository<AINews, Long> {
    List<AINews> findAllByOrderByCreatedAtDesc(); // 최신순 정렬된 뉴스 조회

    List<AINews> findByCreatedAtBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);
}
