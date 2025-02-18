package ssafy.com.ssacle.match.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.com.ssacle.match.domain.Game;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long>, GameRepositoryCustom {

    // 특정 SsaldCup의 특정 주차 리그 일정 조회
//    @Query("SELECT g FROM Game g JOIN FETCH g.ssaldCup sc WHERE sc.id = :ssaldCupId AND g.week = :week")
//    List<Game> findBySsaldCupIdAndWeek(@Param("ssaldCupId") Long ssaldCupId, @Param("week") Integer week);


    // 특정 SsaldCup의 전체 리그 일정 조회
    List<Game> findBySsaldCupId(Long ssaldCupId);
}
