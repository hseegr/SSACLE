package ssafy.com.ssacle.gpt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GptRequest {
    private String model = "gpt-4";
    private List<GptMessage> messages;
}
