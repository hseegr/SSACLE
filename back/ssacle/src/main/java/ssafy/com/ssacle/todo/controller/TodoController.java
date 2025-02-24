package ssafy.com.ssacle.todo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.gpt.dto.TodoResponse;
import ssafy.com.ssacle.todo.dto.TodoCreateRequest;
import ssafy.com.ssacle.todo.dto.TodoResponseDTO;
import ssafy.com.ssacle.todo.service.TodoService;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.service.UserService;
import ssafy.com.ssacle.userteam.service.UserTeamService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/todos")
public class TodoController implements TodoSwaggerController{

    private final UserService userService;
    private final UserTeamService userTeamService;
    private final TodoService todoService;

    @Override
    public ResponseEntity<List<TodoResponse>> getTodoByTeamId(@PathVariable Long teamId) {
        Long userId = userService.getAuthenticatedUser().getId();
        userTeamService.isUserInTeam(userId, teamId);

        List<TodoResponse> todos = todoService.getTodosByTeamId(teamId);

        return ResponseEntity.ok(todos);
    }

    @Override
    public ResponseEntity<Void> updateTodoStatus(@PathVariable Long todoId) {
        todoService.updateTodoStatus(todoId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> deleteTodo(@PathVariable Long todoId) {
        todoService.deleteTodo(todoId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<TodoResponseDTO> createTodo(@PathVariable Long teamId, @RequestBody TodoCreateRequest request) {
        Long userId = userService.getAuthenticatedUser().getId();
        userTeamService.isUserInTeam(userId, teamId);

        TodoResponseDTO createdTodo = todoService.createTodo(teamId, request);
        return ResponseEntity.status(201).body(createdTodo);
    }
}
