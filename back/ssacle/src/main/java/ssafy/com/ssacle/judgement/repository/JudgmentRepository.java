package ssafy.com.ssacle.judgement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.com.ssacle.judgement.domain.Judgment;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.user.domain.User;

import java.util.Optional;

public interface JudgmentRepository extends JpaRepository<Judgment, Long> {

    @Query("SELECT j FROM Judgment j JOIN FETCH j.user WHERE j.sprint = :sprint")
    Optional<Judgment> findBySprint(@Param("sprint") Sprint sprint);

    Optional<Judgment> findByUser(User user);
    void deleteByUserAndSprint(User user, Sprint sprint);
}