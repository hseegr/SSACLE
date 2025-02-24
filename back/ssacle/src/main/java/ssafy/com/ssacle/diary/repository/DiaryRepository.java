package ssafy.com.ssacle.diary.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ssafy.com.ssacle.diary.domain.Diary;
import ssafy.com.ssacle.team.domain.Team;

import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findByTeamInOrderByDateAsc(List<Team> teams);

    /** 해당 스프린트의 전체 다이어리 개수 */
    @Query("SELECT COUNT(d) FROM Diary d WHERE d.team.sprint.id = :sprintId")
    long countAllDiariesBySprint(@Param("sprintId") Long sprintId);

    /** 직접 작성된 다이어리 개수 (기본 메시지가 아닌 경우) */
    @Query("SELECT COUNT(d) FROM Diary d WHERE d.team.sprint.id = :sprintId AND d.content <> :defaultMessage")
    long countWrittenDiariesBySprint(@Param("sprintId") Long sprintId, @Param("defaultMessage") String defaultMessage);

}
