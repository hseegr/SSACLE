package ssafy.com.ssacle.board.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@Builder
public class BoardUpdateRequestDTO {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotEmpty(message = "태그는 최소 1개 이상 입력해야 합니다.")
    private List<String> tags;
}
