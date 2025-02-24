package ssafy.com.ssacle.todo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.com.ssacle.todo.domain.DefaultTodo;

import java.util.List;

public interface DefaultTodoRepository extends JpaRepository<DefaultTodo, Long> {
    List<DefaultTodo> findBySprint_Id(Long sprintId);
}
