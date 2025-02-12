package ssafy.com.ssacle.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.user.domain.User;

@Getter
@Builder
public class UserResponseDTO {
    @NotBlank
    private String nickname;
    @NotBlank
    private int level;
    @NotBlank
    private int pickles;
    @NotBlank
    private String profile;

    public static UserResponseDTO of(User user) {
        return UserResponseDTO.builder()
                .nickname(user.getNickname())
                .level(user.getLevel())
                .pickles(user.getPickles())
                .profile(user.getProfile())
                .build();
    }


}
