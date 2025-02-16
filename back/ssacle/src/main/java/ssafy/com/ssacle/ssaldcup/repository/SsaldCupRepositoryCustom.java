package ssafy.com.ssacle.ssaldcup.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.ssaldcup.domain.SsaldCup;

import java.util.Optional;

public interface SsaldCupRepositoryCustom {
    Page<SsaldCup> findBySsaldCupsByStatus(Integer status, Pageable pageable);
    Page<SsaldCup> findSsaldCupsByCategoryAndStatus(Long categoryId, Integer status, Pageable pageable);

}
