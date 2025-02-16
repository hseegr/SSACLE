package ssafy.com.ssacle.sprint.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import ssafy.com.ssacle.sprint.domain.PresentationStatus;

@Getter
@AllArgsConstructor
public class PresentationStatusUpdateResponseDTO {
    private String message;

    private PresentationStatus presentationStatus;

}
