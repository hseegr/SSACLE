package ssafy.com.ssacle.gpt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * GPT 응답 데이터 (추가적인 데이터 포함)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GptFullResponse {
    private String basicDescription;
    private String detailDescription;
    private String recommendedFor;
    private List<TodoResponse> todos;
}
