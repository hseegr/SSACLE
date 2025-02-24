package ssafy.com.ssacle.comment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class CommentResponseDTO {
    @NotBlank
    private Long id;
    @NotBlank
    private String content;

    @NotBlank
    private String writerInfo;

    @NotBlank
    private LocalDateTime time;

    private List<CommentResponseDTO> child;
}
