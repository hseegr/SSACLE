package ssafy.com.ssacle.category.repository;

import ssafy.com.ssacle.category.dto.CategoryNameAndLevelResponseDTO;

import java.util.List;

public interface CategoryRepositoryCustom {
    List<CategoryNameAndLevelResponseDTO> findCategoryNamesBySprintId(Long SprintId);

    List<CategoryNameAndLevelResponseDTO> findCategoryNamesBySsaldCupId(Long ssaldCupId);
}
