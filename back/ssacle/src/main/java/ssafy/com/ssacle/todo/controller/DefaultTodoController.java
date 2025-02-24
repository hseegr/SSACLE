package ssafy.com.ssacle.todo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import ssafy.com.ssacle.todo.dto.DefaultTodoResponse;
import ssafy.com.ssacle.todo.service.DefaultTodoService;

import java.util.List;

@Controller
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class DefaultTodoController implements DefaultTodoSwaggerController{
    private final DefaultTodoService defaultTodoService;

    @Override
    public ResponseEntity<List<DefaultTodoResponse>> getDefaultTodosBySprintId(@PathVariable Long sprintId) {
        List<DefaultTodoResponse> defaultTodos = defaultTodoService.getDefaultTodosBySprintId(sprintId);
        return ResponseEntity.ok(defaultTodos);
    }
}
