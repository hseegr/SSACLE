package ssafy.com.ssacle.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.category.domain.Category;
import ssafy.com.ssacle.user.domain.User;

import java.util.List;

@Getter
@Builder
public class UserResponseDTO {
    @NotBlank
    private Long id;
    @NotBlank
    private String nickname;
    @NotBlank
    private int level;
    @NotBlank
    private int pickles;
    @NotBlank
    private String profile;
    @NotBlank
    List<String> categoryNames;

    public static UserResponseDTO of(User user,List<String> categories) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .level(user.getLevel())
                .pickles(user.getPickles())
                .profile(user.getProfile())
                .categoryNames(categories) // 초기화된 리스트 사용
                .build();
    }

}
