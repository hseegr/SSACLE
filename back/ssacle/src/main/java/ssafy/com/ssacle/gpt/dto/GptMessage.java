package ssafy.com.ssacle.gpt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GptMessage {
    private String role;
    private String content;
}

