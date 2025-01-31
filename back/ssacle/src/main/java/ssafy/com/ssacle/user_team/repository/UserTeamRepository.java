package ssafy.com.ssacle.user_team.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.com.ssacle.user_team.domain.UserTeam;

public interface UserTeamRepository extends JpaRepository<UserTeam, Long> {
}
