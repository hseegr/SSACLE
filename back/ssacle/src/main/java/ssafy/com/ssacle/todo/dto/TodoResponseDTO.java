package ssafy.com.ssacle.todo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class TodoResponseDTO {
    private LocalDate date;
    private List<TodoContent> contents; // ✅ 날짜별 Todo 리스트
}
