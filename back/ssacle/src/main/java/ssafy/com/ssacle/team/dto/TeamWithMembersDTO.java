package ssafy.com.ssacle.team.dto;

import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.user.dto.UserResponseDTO;

import java.util.List;

@Getter
@Builder
public class TeamWithMembersDTO {
    private Long id;
    private String name;
    private int point;
    private List<UserResponseDTO> users;
}
