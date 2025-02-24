package ssafy.com.ssacle.board.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@Builder
public class BoardRequestDTO {

    private String majorCategory;

    private String subCategory;

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotBlank
    private List<String> tags;
}
