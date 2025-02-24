package ssafy.com.ssacle.lunch.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ssafy.com.ssacle.lunch.domain.Lunch;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LunchRepository extends JpaRepository<Lunch, Long> {
    List<Lunch> findByDay(LocalDateTime day);

    @Query("SELECT l FROM Lunch l WHERE DATE(l.day) = CURRENT_DATE")
    List<Lunch> findTodayLunch();
}
