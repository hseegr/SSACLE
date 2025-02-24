package ssafy.com.ssacle.todo.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.todo.domain.QTodo;
import ssafy.com.ssacle.todo.domain.Todo;

import java.util.List;

@RequiredArgsConstructor
public class TodoRepositoryImpl implements TodoRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Todo> findTodosByTeamSorted(Team team) {
        QTodo todo = QTodo.todo;

        return queryFactory
                .selectFrom(todo)
                .where(todo.team.eq(team))
                .orderBy(todo.date.asc())
                .fetch();
    }
}
