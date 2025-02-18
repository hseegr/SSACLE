package ssafy.com.ssacle.team.repository;

import jakarta.persistence.Id;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.dto.TeamDiaryResponse;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long>, TeamRepositoryCustom {
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

    @Query("SELECT t FROM Team t JOIN FETCH t.userTeams WHERE t.sprint.id = :sprintId")
    List<Team> findBySprintIdWithUserTeams(@Param("sprintId") Long sprintId);

    @Query("SELECT t FROM Team t LEFT JOIN Sprint s ON s.ssaldCup.id = t.ssaldCup.id WHERE t.sprint.id = :sprintId OR (t.sprint.id IS NULL AND s.id = :sprintId)")
    List<Team> findTeamsBySprintOrSsaldCup(@Param("sprintId") Long sprintId);

    boolean existsByName(String name);

    @Query("SELECT t FROM Team t JOIN FETCH t.userTeams ut JOIN FETCH ut.user WHERE t.id = :teamId")
    Optional<Team> findByIdWithUserTeams(@Param("teamId") Long teamId);

    @Query("SELECT t.id FROM Team t WHERE t.sprint.id = :sprintId")
    List<Long> findTeamIdsBySprintId(@Param("sprintId") Long sprintId);

}
