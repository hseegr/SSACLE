package ssafy.com.ssacle.todo.repository;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.todo.domain.Todo;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long>, TodoRepositoryCustom{
    List<Todo> findByTeam(Team team);

    @Query("SELECT COUNT(t) FROM Todo t " +
            "JOIN t.team tm " +
            "JOIN tm.sprint s " +
            "WHERE s.id = :sprintId " +
            "AND t.date BETWEEN s.startAt AND s.endAt")
    long countAllTodosBySprint(@Param("sprintId") Long sprintId);

    @Query("SELECT COUNT(t) FROM Todo t " +
            "JOIN t.team tm " +
            "JOIN tm.sprint s " +
            "WHERE s.id = :sprintId " +
            "AND t.date BETWEEN s.startAt AND s.endAt " +
            "AND t.isDone = true")
    long countCompletedTodosBySprint(@Param("sprintId") Long sprintId);

}
