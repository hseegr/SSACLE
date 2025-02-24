package ssafy.com.ssacle.sprint.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.sprint.dto.*;
import ssafy.com.ssacle.user.dto.UserResponse;
import ssafy.com.ssacle.user.dto.UserResponseDTO;

import java.util.List;

@Tag(name = "Sprint API", description = "Sprint 관련 API입니다.")
public interface SprintSwaggerController {

    @Operation(summary = "스프린트 생성", description = "관리자가 새로운 스프린트를 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "스프린트 생성 성공"),
    })
    @PostMapping("/admin/ssaprints")
    ResponseEntity<SprintResponse> createSprint(@RequestBody SprintCreateRequest request);

    @Operation(summary = "스프린트 참가", description = "사용자가 특정 스프린트에 참가합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "스프린트 참가 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
                    {
                        "status": 400,
                        "code": "Sprint_400_1",
                        "message": "잘못된 요청 데이터입니다."
                    }
                    """))),
            @ApiResponse(responseCode = "403", description = "사용자가 이미 스프린트에 참가함 (Sprint_403_6)",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
                    {
                        "status": 403,
                        "code": "Sprint_403_6",
                        "message": "사용자가 해당 스프린트에 이미 참여했습니다."
                    }
                    """))),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 스프린트 (Sprint_404_2)",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
                    {
                        "status": 404,
                        "code": "Sprint_404_2",
                        "message": "존재하지 않는 스프린트입니다."
                    }
                    """))),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
                    {
                        "status": 500,
                        "code": "INTERNAL_SERVER_ERROR",
                        "message": "서버 내부 오류 발생"
                    }
                    """)))
    })
    @PostMapping("/ssaprint/{sprintId}/join")
    ResponseEntity<Long> joinSprint(@PathVariable Long sprintId, @RequestParam String teamName);

    @Operation(summary = "필터링 조건으로 스프린트 조회", description = "카테고리 ID(선택)와 상태를 기준으로 Sprint 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "스프린트 목록 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
                    {
                        "status": 400,
                        "code": "Sprint_400_1",
                        "message": "잘못된 요청 데이터입니다."
                    }
                    """))),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
                    {
                        "status": 500,
                        "code": "INTERNAL_SERVER_ERROR",
                        "message": "서버 내부 오류 발생"
                    }
                    """)))
    })
    @GetMapping("/search")
    ResponseEntity<Page<SprintAndCategoriesResponseDTO>> getSprintsByCategoryAndStatus(
            @Parameter(description = "카테고리 ID (선택)", example = "1") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "스프린트 상태 (0: 시작 전, 1: 진행 중, 2: 완료)", example = "0") @RequestParam Integer status,
            Pageable pageable
    );

    @Operation(summary = "사용자가 참여중인 스프린트 목록", description = "사용자가 현재 진행 중인 (status: 0,1) 스프린트 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/ongoing")
    ResponseEntity<Page<UserSprintResponseDTO>> getOngoingSprints(Pageable pageable);

    @Operation(summary = "사용자가 완료한 스프린트 목록", description = "사용자가 완료한 (status: 2) 스프린트 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/completed")
    ResponseEntity<Page<UserSprintResponseDTO>> getCompletedSprints(Pageable pageable);

    @Operation(summary = "스프린트 활성 상태 조회", description = "SprintId와 TeamId를 기반으로 활성 상태의 스프린트 데이터를 가져옵니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "스프린트 활성 상태 조회 성공"),
            @ApiResponse(responseCode = "403", description = "사용자가 스프린트에 참여하고 있지 않음 (Sprint_403)",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
                    {
                        "status": 403,
                        "code": "Sprint_403",
                        "message": "사용자가 해당 스프린트에 참여하고 있지 않습니다."
                    }
                    """))),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
                    {
                        "status": 500,
                        "code": "INTERNAL_SERVER_ERROR",
                        "message": "서버 내부 오류 발생"
                    }
                    """)))
    })
    @GetMapping("/active")
    ResponseEntity<ActiveSprintResponse> getActiveSprint(@RequestParam Long sprintId, @RequestParam Long teamId);

    @Operation(summary = "단일 스프린트 조회", description = "SprintId를 기반으로 특정 스프린트를 가져옵니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "스프린트 조회 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 스프린트",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
                    {
                        "status": 404,
                        "code": "Sprint_404_2",
                        "message": "존재하지 않는 스프린트입니다."
                    }
                    """))),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
                    {
                        "status": 500,
                        "code": "INTERNAL_SERVER_ERROR",
                        "message": "서버 내부 오류 발생"
                    }
                    """)))
    })
    @GetMapping("/ssaprint/{id}")
    ResponseEntity<SingleSprintResponse> getSprintById(
            @Parameter(description = "조회할 Sprint ID", example = "1") @PathVariable Long id
    );

    @Operation(summary = "스프린트 상세 조회 + 기본 Todo 리스트",
            description = "특정 스프린트의 상세 정보와 기본 Todo 리스트를 함께 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "스프린트 상세 조회 성공"),
            @ApiResponse(responseCode = "404", description = "해당 스프린트를 찾을 수 없음",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
                    {
                        "status": 404,
                        "code": "Sprint_404_2",
                        "message": "존재하지 않는 스프린트입니다."
                    }
                    """))),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생",
                    content = @Content(mediaType = "application/json", schema = @Schema(example = """
                    {
                        "status": 500,
                        "code": "INTERNAL_SERVER_ERROR",
                        "message": "서버 내부 오류 발생"
                    }
                    """)))
    })
    @GetMapping("/ssaprint/{sprintId}/details")
    ResponseEntity<SprintDetailResponse> getSprintDetails(
            @Parameter(description = "조회할 Sprint ID", example = "1") @PathVariable Long sprintId
    );

    @Operation(summary = "Sprint에 속한 사용자 조회", description = "특정 Sprint ID에 속한 모든 사용자 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "Sprint를 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @GetMapping("/{sprintId}/users")
    ResponseEntity<List<UserResponse>> getUsersBySprint(@PathVariable Long sprintId);
}
