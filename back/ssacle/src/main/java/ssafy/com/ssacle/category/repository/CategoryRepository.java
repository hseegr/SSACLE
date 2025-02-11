package ssafy.com.ssacle.category.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.com.ssacle.category.domain.Category;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @EntityGraph(attributePaths = {"children"})
    List<Category>findAll();

    // 상위 카테고리 조회 (parent가 NULL인 경우)
    List<Category> findByParentIsNull();

    // 특정 상위 카테고리의 하위 카테고리 조회
    List<Category> findByParentId(Long parentId);
    List<Category> findByParent(Category parent);


    // 특정 카테고리 이름으로 조회
    Optional<Category> findByCategoryName(String categoryName);
}
