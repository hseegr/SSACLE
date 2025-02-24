package ssafy.com.ssacle.todo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TodoContent {
    private Long id;
    private String task;
    private boolean isDone;
}