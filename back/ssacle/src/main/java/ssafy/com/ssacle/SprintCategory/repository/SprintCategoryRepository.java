package ssafy.com.ssacle.SprintCategory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.com.ssacle.SprintCategory.domain.SprintCategory;

import java.util.List;

public interface SprintCategoryRepository extends JpaRepository<SprintCategory, Long> {
    List<SprintCategory> findByCategoryIdIn(List<Long> categoryIds);

    List<SprintCategory> findBySprintIdIn(List<Long> sprintIds);

}
