package ssafy.com.ssacle.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpdatePasswordResponseDTO {
    private String message;
    private Long userId;
}
