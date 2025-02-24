package ssafy.com.ssacle.todo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.todo.domain.DefaultTodo;
import ssafy.com.ssacle.todo.exception.TodoDateNotExistException;
import ssafy.com.ssacle.todo.exception.TodoNotExistException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class TodoRequest {
    private LocalDate date;
    private List<String> tasks;

    public List<DefaultTodo> toEntity(Sprint sprint){
        if (tasks == null || tasks.isEmpty()){
            throw new TodoNotExistException();
        } if(date == null){
            throw new TodoDateNotExistException();
        }


        return tasks.stream()
                .map(task -> DefaultTodo.builder()
                        .sprint(sprint)
                        .content(task)
                        .date(date)
                        .build())
                .collect(Collectors.toList());
    }
}
