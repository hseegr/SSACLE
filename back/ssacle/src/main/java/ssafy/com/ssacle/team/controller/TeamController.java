package ssafy.com.ssacle.team.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.team.dto.TeamRequestDto;
import ssafy.com.ssacle.team.dto.TeamResponseDto;
import ssafy.com.ssacle.team.service.TeamService;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    // 팀 생성 API
    @PostMapping("/create")
    public ResponseEntity<TeamResponseDto> createTeam(@RequestHeader("Authorization") String token,
                                                      @RequestBody TeamRequestDto requestDto) {
        TeamResponseDto responseDto = teamService.createTeam(token, requestDto);
        return ResponseEntity.ok(responseDto);
    }
}
