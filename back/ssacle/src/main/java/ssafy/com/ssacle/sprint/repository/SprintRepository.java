package ssafy.com.ssacle.sprint.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.team.domain.Team;

import java.util.List;
import java.util.Optional;

public interface SprintRepository extends JpaRepository<Sprint, Long>, SprintRepositoryCustom {

    @Query("SELECT s FROM Sprint s JOIN FETCH s.defaultTodos WHERE s.id = :id")
    Optional<Sprint> findWithDefaultTodosById(@Param("id") Long id);

    @Query("SELECT s FROM Sprint s JOIN FETCH s.sprintCategories sc JOIN FETCH sc.category WHERE s.id = :id")
    Optional<Sprint> findWithSprintCategoriesById(@Param("id") Long id);

    @Query("SELECT s FROM Sprint s LEFT JOIN FETCH s.teams")
    List<Sprint> findAllWithTeams();

    @Query("SELECT DISTINCT s FROM Sprint s " +
            "JOIN s.teams t " +
            "WHERE t.id IN :teamIds")
    List<Sprint> findSprintsByTeamIds(@Param("teamIds") List<Long> teamIds);
//    @Query("SELECT DISTINCT s FROM Sprint s " +
//            "JOIN FETCH s.teams t " +
//            "JOIN FETCH t.userTeams ut " +
//            "WHERE ut.user.id = :userId")
//    List<Sprint> findAllByUserId(Long userId);

    @Query("SELECT DISTINCT s FROM Sprint s " +
            "JOIN FETCH s.teams t " +
            "WHERE FUNCTION('DATE', s.announceAt) = CURRENT_DATE")
    List<Sprint> findSprintsByPresentationDate();

    List<Sprint> findByStatus(int status);

    @Query("SELECT t FROM Sprint s JOIN s.teams t WHERE s.status = :status")
    List<Team> findTeamsByStatus(int status);


}

