package ssafy.com.ssacle.userteam.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.com.ssacle.userteam.domain.UserTeam;

import java.util.List;

public interface UserTeamRepository extends JpaRepository<UserTeam, Long> {
    List<UserTeam> findByUserId(Long userId);
}
