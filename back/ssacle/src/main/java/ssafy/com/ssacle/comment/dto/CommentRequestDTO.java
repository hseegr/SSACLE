package ssafy.com.ssacle.comment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CommentRequestDTO {
    @NotBlank
    private String content;
}
