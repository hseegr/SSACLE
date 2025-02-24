package ssafy.com.ssacle.user.dto;

import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.user.domain.User;

@Getter
public class UserResponse {
    private final Long id;
    private final String name;
    private final String email;
    private final String nickname;
    private final String profile;

    @Builder
    public UserResponse(Long id, String name, String email, String nickname, String profile) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.nickname = nickname;
        this.profile = profile;
    }

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profile(user.getProfile())
                .build();
    }
}
