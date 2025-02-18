package ssafy.com.ssacle.presentation.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.presentation.dto.PresentationRequestDTO;
import ssafy.com.ssacle.presentation.dto.PresentationStatusUpdateResponseDTO;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.dto.TeamWinnerResponseDTO;
import ssafy.com.ssacle.team.dto.TeamWithMembersDTO;
import ssafy.com.ssacle.user.dto.UserResponseDTO;

import java.util.List;

@Tag(name = "Presentation API", description = "Presentation 관련 API입니다.")
public interface PresentationSwaggerController {

    @Operation(summary = "발표 상태 업데이트", description = "스프린트의 발표 상태를 다음 단계로 변경합니다. 한 번에 한 단계씩만 진행 가능합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "발표 상태 업데이트 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터 또는 잘못된 상태 변경", content = @Content),
            @ApiResponse(responseCode = "404", description = "해당 스프린트를 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @PatchMapping("/ssaprint/{sprintId}/presentation-status")
    ResponseEntity<PresentationStatusUpdateResponseDTO> updatePresentationStatus(
            @Parameter(description = "상태를 변경할 Sprint ID", example = "1")
            @PathVariable Long sprintId
    );

    @Operation(summary = "발표 참가 가능 여부 확인",
            description = "현재 시간이 발표 참여 가능한 시간인지 확인하는 API. 발표 30분 전부터 입장 가능하며, 발표 시간이 지나면 참여 불가합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "발표 참여 가능 여부 반환"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터", content = @Content),
            @ApiResponse(responseCode = "404", description = "해당 스프린트를 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @GetMapping("/ssaprint/{sprintId}/presentation-availability")
    ResponseEntity<Boolean> checkPresentationAvailability(
            @Parameter(description = "발표 참가 가능 여부를 확인할 Sprint ID", example = "1")
            @PathVariable Long sprintId
    );

    @Operation(summary = "최종 점수 계산", description = "발표 점수를 포함한 최종 점수를 계산하고 1등 팀을 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "점수 계산 완료 및 1등 팀 반환"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터", content = @Content),
            @ApiResponse(responseCode = "404", description = "팀 또는 스프린트 정보를 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @PostMapping("/calculate")
    ResponseEntity<TeamWinnerResponseDTO> calculateFinalScores(
            @Parameter(description = "팀과 발표 점수를 포함한 요청 리스트") @RequestBody List<PresentationRequestDTO> requestList
    );

    @Operation(summary = "발표 참가자 목록 조회",
            description = "특정 Sprint의 발표 참가자 목록을 반환하는 API입니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "참가자 목록 반환 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터", content = @Content),
            @ApiResponse(responseCode = "404", description = "해당 스프린트를 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @GetMapping("/ssaprint/{sprintId}/presentation-participants")
    ResponseEntity<List<TeamWithMembersDTO>> getPresentationParticipants(
            @Parameter(description = "발표 참가자 목록을 조회할 Sprint ID", example = "1")
            @PathVariable Long sprintId
    );

}
