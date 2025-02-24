package ssafy.com.ssacle.todo.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.gpt.dto.TodoResponse;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.exception.TeamNotFoundException;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.todo.domain.Todo;
import ssafy.com.ssacle.todo.dto.TodoContent;
import ssafy.com.ssacle.todo.dto.TodoCreateRequest;
import ssafy.com.ssacle.todo.dto.TodoResponseDTO;
import ssafy.com.ssacle.todo.exception.TodoNotExistException;
import ssafy.com.ssacle.todo.repository.TodoRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;
    private final TeamRepository teamRepository;

    @Transactional
    public List<TodoResponse> getTodosByTeamId(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(TeamNotFoundException::new);

        List<Todo> todos = todoRepository.findByTeam(team);

        Map<java.time.LocalDate, List<String>> groupedTodos = todos.stream()
                .collect(Collectors.groupingBy(Todo::getDate, Collectors.mapping(Todo::getContent, Collectors.toList())));

        return groupedTodos.entrySet().stream()
                .map(entry -> new TodoResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    public void updateTodoStatus(Long todoId) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(TodoNotExistException::new);
        todo.setDone(!todo.isDone());
        todoRepository.save(todo);
    }

    public void deleteTodo(Long todoId) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(TodoNotExistException::new);
        todoRepository.delete(todo);
    }

    public TodoResponseDTO createTodo(Long teamId, TodoCreateRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(TeamNotFoundException::new);

        Todo newTodo = Todo.builder()
                .team(team)
                .content(request.getContent())
                .date(request.getDate())
                .isDone(false)
                .build();

        todoRepository.save(newTodo);

        return new TodoResponseDTO(newTodo.getDate(), List.of(new TodoContent(newTodo.getId(), newTodo.getContent(), newTodo.isDone())));
    }
}
