package ssafy.com.ssacle.userteam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.com.ssacle.userteam.domain.UserTeam;

import java.util.List;

public interface UserTeamRepository extends JpaRepository<UserTeam, Long> {
    List<UserTeam> findByUserId(Long userId);

    @Query("SELECT ut FROM UserTeam ut " +
            "JOIN FETCH ut.team t " +
            "JOIN FETCH t.sprint s " +
            "WHERE ut.user.id = :userId AND s.id = :sprintId")
    List<UserTeam> findUserTeamsWithSprint(@Param("userId") Long userId, @Param("sprintId") Long sprintId);
}
