package ssafy.com.ssacle.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProfileUpdateResponseDTO {
    private String message;
    private Long userId;
}
