package ssafy.com.ssacle.ainews.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AINewsRequestDTO {
    private String title;
    private String url;
}
