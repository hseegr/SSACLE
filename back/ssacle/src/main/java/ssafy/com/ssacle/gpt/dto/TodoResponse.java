package ssafy.com.ssacle.gpt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class TodoResponse {
    private LocalDate date;
    private List<String> tasks;
}
