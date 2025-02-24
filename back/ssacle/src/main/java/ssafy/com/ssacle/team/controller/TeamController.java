package ssafy.com.ssacle.team.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.team.dto.TeamDiaryResponse;
import ssafy.com.ssacle.team.dto.TeamResponseDTO;
import ssafy.com.ssacle.team.service.TeamService;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class TeamController implements TeamSwaggerController {

    private final UserService userService;
    private final TeamService teamService;

    @Override
    public ResponseEntity<List<Long>> getTeamUsers(@PathVariable Long teamId) {
        List<Long> response = teamService.getTeamMembers(teamId);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<List<TeamResponseDTO>> getTeamsBySprintId(Long sprintId) {
        List<TeamResponseDTO> teams = teamService.getTeamsBySprintId(sprintId);
        return ResponseEntity.ok(teams);
    }

    @Override
    public ResponseEntity<Page<TeamDiaryResponse>> getAllTeamsWithDiaries(Pageable pageable) {
        Page<TeamDiaryResponse> response = teamService.getAllTeamsWithDiaries(pageable);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<String> purchaseTeam(@PathVariable Long teamId) {
        User user = userService.getAuthenticatedUserWithTeams();
        String notionURL = teamService.purchaseTeam(user, teamId);
        return ResponseEntity.ok(notionURL);
    }
}
