package ssafy.com.ssacle.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckStudentNumberDTO {
    @Schema(description = "사용자  학번", example = "1240587")
    private String studentNumber;
}
