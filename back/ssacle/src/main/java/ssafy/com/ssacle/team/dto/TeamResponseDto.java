package ssafy.com.ssacle.team.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TeamResponseDto {
    private Long id;
    private String name;
    private int count;
}
