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
public class CheckPasswordDTO {
    @Schema(description = "비밀번호", example = "rlatngus@1")
    private String password;

    @Schema(description = "확인용 비밀번호", example = "rlatngus@1")
    private String confirmpassword;
}
