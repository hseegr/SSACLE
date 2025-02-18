package ssafy.com.ssacle.match.repository;

import org.springframework.data.repository.query.Param;
import ssafy.com.ssacle.match.domain.Game;

import java.util.List;

public interface GameRepositoryCustom {
    List<Game> findBySsaldCupIdAndWeek(@Param("ssaldCupId") Long ssaldCupId, @Param("week") Integer week);
}
