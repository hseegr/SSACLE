package ssafy.com.ssacle.todo.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class TodoCreateRequest {
    private String content;
    private LocalDate date;
}
