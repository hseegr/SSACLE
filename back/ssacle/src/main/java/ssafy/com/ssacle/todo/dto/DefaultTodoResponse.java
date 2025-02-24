package ssafy.com.ssacle.todo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import ssafy.com.ssacle.todo.domain.DefaultTodo;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class DefaultTodoResponse {
    private LocalDate date;
    private List<String> tasks;

    public static List<DefaultTodoResponse> fromEntities(List<DefaultTodo> todos) {
        return todos.stream()
                .collect(Collectors.groupingBy(DefaultTodo::getDate, Collectors.mapping(DefaultTodo::getContent, Collectors.toList())))
                .entrySet().stream()
                .map(entry -> new DefaultTodoResponse(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(DefaultTodoResponse::getDate))
                .toList();
    }
}

