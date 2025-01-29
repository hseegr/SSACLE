package ssafy.com.ssacle.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.com.ssacle.user.domain.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);


}
