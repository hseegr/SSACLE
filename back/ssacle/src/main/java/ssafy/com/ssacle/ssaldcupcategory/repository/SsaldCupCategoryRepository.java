package ssafy.com.ssacle.ssaldcupcategory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.com.ssacle.ssaldcupcategory.domain.SsaldCupCategory;

import java.util.List;

public interface SsaldCupCategoryRepository extends JpaRepository<SsaldCupCategory, Long> {
    List<SsaldCupCategory> findByCategoryIdIn(List<Long> categoryIds);

    List<SsaldCupCategory> findBySsaldCupIdIn(List<Long> ssaldCupIds);
}
