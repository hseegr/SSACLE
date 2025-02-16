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
//    @Query("SELECT s FROM SsaldCup s LEFT JOIN FETCH s.teams t LEFT JOIN FETCH t.userTeams ut LEFT JOIN FETCH ut.user WHERE s.id = :ssaldCupId")
//    Optional<SsaldCup> findByIdWithTeams(Long ssaldCupId);


    @Query("SELECT s FROM SsaldCup s WHERE s.id = :ssaldCupId")
    Optional<SsaldCup> findByIdWithoutTeams(@Param("ssaldCupId") Long ssaldCupId);

}
