package ssafy.com.ssacle.sprint.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.sprint.dto.PresentationStatusUpdateResponseDTO;
import ssafy.com.ssacle.sprint.service.SprintService;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PresentationController implements PresentationSwaggerController{
    private final SprintService sprintService;
    @Override
    public ResponseEntity<PresentationStatusUpdateResponseDTO> updatePresentationStatus(Long sprintId) {
        return ResponseEntity.ok().body(sprintService.updatePresentationStatus(sprintId));
    }

    @Override
    public ResponseEntity<Boolean> checkPresentationAvailability(Long sprintId) {
        boolean canParticipate = sprintService.checkPresentationAvailability(sprintId);
        return ResponseEntity.ok(canParticipate);
    }

}
