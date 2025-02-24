package ssafy.com.ssacle.userteam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.userteam.domain.UserTeam;

import java.util.List;
import java.util.Optional;

public interface UserTeamRepository extends JpaRepository<UserTeam, Long> {
    List<UserTeam> findByUserId(Long userId);

    @Query("SELECT ut FROM UserTeam ut " +
            "JOIN FETCH ut.team t " +
            "JOIN FETCH t.sprint s " +
            "WHERE ut.user.id = :userId AND s.id = :sprintId")
    List<UserTeam> findUserTeamsWithSprint(@Param("userId") Long userId, @Param("sprintId") Long sprintId);

    @Query("SELECT ut.team FROM UserTeam ut WHERE ut.user.id = :userId")
    List<Team> findTeamsByUserId(@Param("userId") Long userId);

    /** 특정 사용자가 속한 Team을 찾음 */
    @Query("SELECT ut.team FROM UserTeam ut WHERE ut.user.id = :userId")
    Optional<Team> findTeamByUserId(@Param("userId") Long userId);

    /** 특정 사용자(userId)가 특정 팀(teamId)에 속해 있는지 확인하는 메서드 */
    @Query("SELECT COUNT(ut) > 0 FROM UserTeam ut WHERE ut.user.id = :userId AND ut.team.id = :teamId")
    boolean existsByUserIdAndTeamId(@Param("userId") Long userId, @Param("teamId") Long teamId);

    /** 특정 사용자가 sprintId에 속하는지 여부를 true / false로 반환 */
    @Query("SELECT COUNT(ut) FROM UserTeam ut " +
            "JOIN ut.team t " +
            "WHERE ut.user.id = :userId AND t.sprint.id = :sprintId")
    long countByUserIdAndSprintId(@Param("userId") Long userId, @Param("sprintId") Long sprintId);


}
