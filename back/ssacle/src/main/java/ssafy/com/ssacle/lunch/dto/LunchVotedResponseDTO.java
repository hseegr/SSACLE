package ssafy.com.ssacle.lunch.dto;

import lombok.Getter;
import lombok.Setter;
import ssafy.com.ssacle.lunch.domain.Lunch;

@Getter
@Setter
public class LunchVotedResponseDTO extends LunchResponseDTO{
    private double votePercentage;
    public LunchVotedResponseDTO(Lunch lunch, double votePercentage) {
        super(lunch);
        this.votePercentage = votePercentage;
    }
}
