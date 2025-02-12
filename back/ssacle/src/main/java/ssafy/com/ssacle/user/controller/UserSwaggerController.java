package ssafy.com.ssacle.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import ssafy.com.ssacle.sprint.dto.SprintSummaryResponse;
import ssafy.com.ssacle.user.dto.UserResponseDTO;

import java.util.List;

@Tag(name = "User API", description = "사용자 정보 조회 및 수정 API입니다.")
public interface UserSwaggerController {

    @Operation(summary = "사용자 정보 조회", description = "현재 인증된 사용자의 정보를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "사용자 정보 조회 성공",
                    content = @Content(schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자입니다.", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 에러 발생", content = @Content)
    })
    @GetMapping("/summary")
    ResponseEntity<UserResponseDTO> getUserInfo();

    @Operation(summary = "참여 중인 스프린트 요약 정보 조회",
            description = "현재 인증된 사용자가 참여 중인 스프린트의 요약 정보를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "스프린트 정보 조회 성공",
                    content = @Content(schema = @Schema(implementation = SprintSummaryResponse.class))),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자입니다.", content = @Content),
            @ApiResponse(responseCode = "404", description = "사용자가 참여 중인 스프린트가 없습니다.", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 에러 발생", content = @Content)
    })
    @GetMapping("/sprint")
    ResponseEntity<List<SprintSummaryResponse>> getUserParticipateSprint();

}
