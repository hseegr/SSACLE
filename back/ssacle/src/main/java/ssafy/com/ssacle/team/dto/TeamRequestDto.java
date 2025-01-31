package ssafy.com.ssacle.team.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TeamRequestDto {
    private String name;
    private int count = 1; // 기본값 1명

    public TeamRequestDto(String name, int count) {
        this.name = name;
        this.count = (count > 0) ? count : 1; // 1명 이상만 가능하도록 제한
    }
}
