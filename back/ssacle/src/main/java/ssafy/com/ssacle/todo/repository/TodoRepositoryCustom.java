package ssafy.com.ssacle.todo.repository;

import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.todo.domain.Todo;

import java.util.List;

public interface TodoRepositoryCustom {
    List<Todo> findTodosByTeamSorted(Team team);
}
