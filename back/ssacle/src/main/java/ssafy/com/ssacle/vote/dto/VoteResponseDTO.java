package ssafy.com.ssacle.vote.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VoteResponseDTO {
    private String message;
    private Long voteId;
}
