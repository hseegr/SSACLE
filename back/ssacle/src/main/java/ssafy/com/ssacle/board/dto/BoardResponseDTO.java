package ssafy.com.ssacle.board.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardResponseDTO {
    @NotBlank
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotBlank
    private String writerInfo;

    @NotBlank
    private LocalDateTime time;

    @NotBlank
    private List<String> tags;

    @NotBlank
    private String majorCategory;

    @NotBlank
    private String subCategory;

    private boolean isPurchased;
}
