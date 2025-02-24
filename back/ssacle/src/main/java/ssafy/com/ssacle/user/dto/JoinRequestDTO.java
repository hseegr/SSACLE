package ssafy.com.ssacle.user.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;
import ssafy.com.ssacle.global.enumvalidator.EnumValue;
import ssafy.com.ssacle.user.domain.Role;

@Getter @Setter
@Builder
@Jacksonized
public class JoinRequestDTO {
    @NotBlank(message = "studentNumber is required")
    private String studentNumber;

    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "nickname is required")
    private String nickname;

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank(message = "password is required")
    private String password;

    @NotBlank(message = "confirmpassword is required")
    private String confirmpassword;
}
