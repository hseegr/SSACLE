package ssafy.com.ssacle.user.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ssafy.com.ssacle.user.domain.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByStudentNumber(String studentNumber);

    Optional<User> findByEmailAndStudentNumber(String email, String studentNumber);

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    boolean existsByStudentNumber(String studentNumber);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.userTeams WHERE u.email = :email")
    Optional<User> findUserWithTeamsByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u JOIN FETCH u.userTeams ut JOIN FETCH ut.team t WHERE u.id = :userId")
    Optional<User> findUserWithTeamsById(@Param("userId") Long userId);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.userTeams")
    List<User> findAllWithTeams();

    List<User> findByIdIn(List<Long> userIds);

    @Query("SELECT ut.user.id FROM UserTeam ut WHERE ut.team.id = :teamId")
    List<Long> findUsersIdByTeamId(@Param("teamId") Long teamId);

    @Query("SELECT ut.user.id FROM UserTeam ut WHERE ut.team.id IN :teamIds")
    List<Long> findUserIdsByTeamIds(@Param("teamIds") List<Long> teamIds);

    @Query("SELECT u FROM User u WHERE u.id IN :userIds")
    List<User> findUsersByIds(@Param("userIds") List<Long> userIds);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.userTeams")
    List<User> findAllWithUserTeams();


}

