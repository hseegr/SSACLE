package ssafy.com.ssacle.usercategory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.com.ssacle.usercategory.domain.UserCategory;

public interface UserCategoryRepository extends JpaRepository<UserCategory, Long> {
}
