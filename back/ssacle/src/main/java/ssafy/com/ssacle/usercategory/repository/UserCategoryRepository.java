package ssafy.com.ssacle.usercategory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.usercategory.domain.UserCategory;

import java.util.List;

public interface UserCategoryRepository extends JpaRepository<UserCategory, Long> {
    List<UserCategory> findByUserId(Long userId);
    void deleteByUser(User user);

}
