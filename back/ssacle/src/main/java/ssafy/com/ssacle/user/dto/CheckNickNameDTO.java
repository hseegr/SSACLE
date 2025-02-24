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
public class CheckNickNameDTO {
    @Schema(description = "닉네임", example = "KSH00610")
    private String nickname;
}
