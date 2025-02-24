package ssafy.com.ssacle.questioncard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.com.ssacle.questioncard.domain.QuestionCard;

import java.util.List;

public interface QuestionCardRepository extends JpaRepository<QuestionCard, Long> {
    List<QuestionCard> findBySprintId(Long sprintId);
}
