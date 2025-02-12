package ssafy.com.ssacle.team.repository;

import jakarta.persistence.Id;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.com.ssacle.team.domain.Team;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    @Query("SELECT DISTINCT t FROM Team t " +
            "JOIN t.userTeams ut " +
            "WHERE ut.user.id = :userId")
    List<Team> findTeamsByUserId(@Param("userId") Long userId);

}
