package ssafy.com.ssacle.team.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import ssafy.com.ssacle.team.dto.TeamDiaryResponse;
import ssafy.com.ssacle.team.dto.TeamResponseDTO;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.dto.UserResponse;

import java.util.List;

@Tag(name = "Team API", description = "Sprint에 속한 팀 정보를 제공하는 API입니다.")
public interface TeamSwaggerController {

    @Operation(summary = "특정 팀에 속한 사용자 조회", description = "Team ID로 특정 팀의 모든 팀원 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "해당 팀을 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @GetMapping("/teams/{teamId}/users")
    ResponseEntity<List<Long>> getTeamUsers(@PathVariable Long teamId);

    @Operation(summary = "Sprint에 속한 팀 목록 조회", description = "Sprint ID를 기반으로 해당 Sprint에 속한 모든 팀 정보를 가져옵니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "팀 목록 조회 성공"),
            @ApiResponse(responseCode = "404", description = "해당 Sprint를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생")
    })
    @GetMapping("/sprint/{sprintId}/teams")
    ResponseEntity<List<TeamResponseDTO>> getTeamsBySprintId(
            @Parameter(description = "조회할 Sprint ID", example = "1") @PathVariable Long sprintId);

    @Operation(summary = "모든 팀과 일기 조회", description = "모든 팀과 해당 팀의 일기 내용을 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @GetMapping("/teams/diaries")
    ResponseEntity<Page<TeamDiaryResponse>> getAllTeamsWithDiaries(Pageable pageable);

    @Operation(summary = "팀 NotionURL 구매", description = "팀을 구매하고 참가하여 해당 팀의 NotionURL을 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "구매 및 참가 성공"),
            @ApiResponse(responseCode = "400", description = "팀 참가 불가 또는 잔여 Pickles 부족"),
            @ApiResponse(responseCode = "404", description = "해당 팀을 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @PostMapping("/teams/{teamId}/purchase")
    ResponseEntity<String> purchaseTeam(@Parameter(description = "구매할 팀의 ID", example = "1") @PathVariable Long teamId);
}
