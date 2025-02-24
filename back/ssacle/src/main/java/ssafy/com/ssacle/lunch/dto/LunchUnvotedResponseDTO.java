package ssafy.com.ssacle.lunch.dto;

import lombok.Getter;
import ssafy.com.ssacle.lunch.domain.Lunch;

@Getter
public class LunchUnvotedResponseDTO extends LunchResponseDTO{
    public LunchUnvotedResponseDTO(Lunch lunch){
        super(lunch);
    }
}
