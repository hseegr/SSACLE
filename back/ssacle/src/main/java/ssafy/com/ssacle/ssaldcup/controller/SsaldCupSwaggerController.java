package ssafy.com.ssacle.ssaldcup.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.sprint.dto.SingleSprintResponse;
import ssafy.com.ssacle.sprint.dto.SprintAndCategoriesResponseDTO;
import ssafy.com.ssacle.sprint.dto.SprintCreateRequest;
import ssafy.com.ssacle.sprint.dto.SprintResponse;
import ssafy.com.ssacle.ssaldcup.dto.*;

@Tag(name = "SsaldCup API", description = "SsaldCup 관련 API입니다.")
public interface SsaldCupSwaggerController {
    @Operation(summary = "싸드컵 생성", description = "관리자가 새로운 싸드컵을 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "싸드컵 생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @PostMapping("/admin/ssaldcup")
    ResponseEntity<SsaldCupCreateResponseDTO> createSsaldCup(@RequestBody SsaldCupCreateRequestDTO ssaldCupCreateRequestDTO);

    @Operation(summary = "싸드컵 참가", description = "사용자가 특정 싸드컵에 참가합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "싸드컵 참가 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터", content = @Content),
            @ApiResponse(responseCode = "404", description = "해당 싸드컵을 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @Parameters(value = {
            @Parameter(name = "ssaldcupId", description = "참가할 싸드컵의 ID", example = "1")
    })
    @PostMapping("/ssaldcup/{ssaldcupId}/join")
    ResponseEntity<Void> joinSsaldCup(@PathVariable("ssaldcupId") Long ssaldcupId);

    @Operation(summary = "단일 싸드컵 조회", description = "SsaldCupId를 기반으로 특정 싸드컵을 가져옵니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "싸드컵 조회 성공"),
            @ApiResponse(responseCode = "404", description = "해당 싸드컵을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생")
    })
    @GetMapping("/ssaldcup/{id}")
    ResponseEntity<SingleSsaldCupResponseDTO> getSsaldCupById(@Parameter(description = "조회할 SsaldCup ID", example = "1") @PathVariable Long id);


    @Operation(summary = "카테고리별 SsaldCup 조회", description = "카테고리 ID(선택)와 상태를 기준으로 SsaldCup 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "싸드컵 목록 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @GetMapping("/ssaldcup/filter")
    ResponseEntity<Page<SsaldCupAndCategoriesResponseDTO>> getSsaldCupsByCategoryAndStatus(
            @Parameter(description = "카테고리 ID (선택)", example = "1")
            @RequestParam(required = false) Long categoryId,

            @Parameter(description = "싸드컵 상태 (0: 시작 전, 1: 진행 중, 2: 완료)", example = "0")
            @RequestParam Integer status,

            Pageable pageable
    );

    @Operation(summary = "리그전 생성", description = "참가한 팀들 간의 리그전 일정을 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리그전 생성 성공"),
            @ApiResponse(responseCode = "404", description = "해당 싸드컵을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생")
    })
    @PostMapping("/ssaldcup/{ssaldCupId}/league")
    ResponseEntity<Void> createLeague(@PathVariable Long ssaldCupId);

    @Operation(summary = "특정 싸드컵의 N주차 리그 일정 조회",
            description = "해당 싸드컵의 특정 주차(N주차) 리그 일정을 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "리그 일정 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (주차 범위 초과)", content = @Content),
            @ApiResponse(responseCode = "404", description = "해당 싸드컵을 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생")
    })
    @GetMapping("/ssaldcup/{ssaldCupId}/league/{week}")
    ResponseEntity<LeagueScheduleDTO> getLeagueSchedule(
            @Parameter(description = "싸드컵 ID", example = "1") @PathVariable Long ssaldCupId,
            @Parameter(description = "조회할 주차 (1부터 시작)", example = "3") @PathVariable int week
    );

}
