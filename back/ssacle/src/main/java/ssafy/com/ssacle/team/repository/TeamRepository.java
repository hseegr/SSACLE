package ssafy.com.ssacle.team.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.com.ssacle.team.domain.Team;

import java.util.Optional;


public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findFirstByCountLessThan(int maxSize);
}
