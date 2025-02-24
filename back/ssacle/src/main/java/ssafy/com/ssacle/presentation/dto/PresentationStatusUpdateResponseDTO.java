package ssafy.com.ssacle.presentation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import ssafy.com.ssacle.presentation.domain.PresentationStatus;

@Getter
@AllArgsConstructor
public class PresentationStatusUpdateResponseDTO {
    private String message;
    private Long sprintId;
    private PresentationStatus presentationStatus;

}
