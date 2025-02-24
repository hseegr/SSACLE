package ssafy.com.ssacle.ssaldcup.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ssafy.com.ssacle.ssaldcup.domain.SsaldCup;

import java.util.Optional;

@Repository
public interface SsaldCupRepository extends JpaRepository<SsaldCup, Long>, SsaldCupRepositoryCustom{

}
