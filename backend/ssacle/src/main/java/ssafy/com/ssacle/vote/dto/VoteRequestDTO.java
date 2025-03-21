package ssafy.com.ssacle.vote.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoteRequestDTO {
    @JsonProperty("lunchId")
    private Long lunchId;
}
