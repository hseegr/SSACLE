package ssafy.com.ssacle.presentation.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.presentation.dto.PresentationRequestDTO;
import ssafy.com.ssacle.presentation.dto.PresentationStatusUpdateResponseDTO;
import ssafy.com.ssacle.presentation.service.PresentationService;
import ssafy.com.ssacle.sprint.service.SprintService;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.user.dto.UserResponseDTO;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PresentationController implements PresentationSwaggerController{
    private final SprintService sprintService;
    private final PresentationService presentationService;
    private final TeamRepository teamRepository;

    @Override
    public ResponseEntity<PresentationStatusUpdateResponseDTO> updatePresentationStatus(Long sprintId) {
        return ResponseEntity.ok().body(sprintService.updatePresentationStatus(sprintId));
    }

    @Override
    public ResponseEntity<Boolean> checkPresentationAvailability(Long sprintId) {
        boolean canParticipate = sprintService.checkPresentationAvailability(sprintId);
        return ResponseEntity.ok(canParticipate);
    }

    @Override
    public ResponseEntity<Team> calculateFinalScores(@RequestBody List<PresentationRequestDTO> requestList) {
        Team topTeam = requestList.stream()
                .map(request -> {
                    Team team = teamRepository.findById(request.getTeamId())
                            .orElseThrow(() -> new RuntimeException("해당 팀을 찾을 수 없습니다."));
                    presentationService.calculateFinalScore(team, request.getSprintId(), request.getJudgeScore());
                    return team;
                })
                .max(Comparator.comparingInt(Team::getPoint))
                .orElseThrow(() -> new RuntimeException("점수를 계산할 팀이 없습니다."));

        return ResponseEntity.ok(topTeam);
    }

    @Override
    public ResponseEntity<List<UserResponseDTO>> getPresentationParticipants(Long sprintId) {
        return ResponseEntity.ok().body(sprintService.getPresentationParticipants(sprintId));
    }

}
