package ssafy.com.ssacle.team.repository;

import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.team.domain.Team;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    @Query("SELECT DISTINCT t FROM Team t " +
            "JOIN t.userTeams ut " +
            "WHERE ut.user.id = :userId")
    List<Team> findTeamsByUserId(@Param("userId") Long userId);


    @Query("SELECT DISTINCT t FROM Team t " +
            "LEFT JOIN FETCH t.userTeams ut " +
            "LEFT JOIN FETCH ut.user " +
            "WHERE t.sprint.id IN :sprintIds")
    List<Team> findTeamsWithUsersBySprintIds(@Param("sprintIds") List<Long> sprintIds);

    @Query("SELECT t FROM Team t WHERE t.ssaldCup.id = :ssaldCupId")
    List<Team> findBySsaldCupId(@Param("ssaldCupId") Long ssaldCupId);

    List<Team> findBySprintIdIn(List<Long> sprintIds);

    List<Team> findBySprint(Sprint sprint);

    @Query("SELECT t FROM Team t WHERE t.sprint.id = :sprintId")
    List<Team> findBySprintId(Long sprintId);
}
