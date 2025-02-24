package ssafy.com.ssacle.todo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.todo.domain.DefaultTodo;
import ssafy.com.ssacle.todo.dto.DefaultTodoResponse;
import ssafy.com.ssacle.todo.repository.DefaultTodoRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DefaultTodoService {
    private final DefaultTodoRepository defaultTodoRepository;

    public List<DefaultTodoResponse> getDefaultTodosBySprintId(Long sprintId){
        List<DefaultTodo> todos = defaultTodoRepository.findBySprint_Id(sprintId);

        return DefaultTodoResponse.fromEntities(todos);
    }
}
