package ssafy.com.ssacle.vote.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ssafy.com.ssacle.vote.domain.Vote;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long>{
    List<Vote> findByLunchId(Long lunchId);

    @Query("SELECT COUNT(v) > 0 FROM Vote v WHERE v.user.id = :userId AND DATE(v.voteDay) = CURRENT_DATE")
    boolean existsByUserIdAndVoteDay(@Param("userId") Long userId);


    @Query("SELECT COUNT(v) FROM Vote v WHERE DATE(v.voteDay) = CURRENT_DATE")
    long countByVoteDay();

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.lunch.id = :lunchId AND DATE(v.voteDay) = CURRENT_DATE")
    long countByLunchIdAndVoteDay(@Param("lunchId") Long lunchId);


}
