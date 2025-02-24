package ssafy.com.ssacle.gpt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GptFullRawResponse {
    private String basicDescription;
    private String detailDescription;
    private String recommendedFor;
    private List<RawTodoResponse> todos;
}
