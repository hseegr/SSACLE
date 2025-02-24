package ssafy.com.ssacle.judgement.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.judgement.dto.JudgmentRequest;
import ssafy.com.ssacle.judgement.dto.JudgmentResponse;

@Tag(name = "Judgment API", description = "Sprint의 심판 관련 API")
public interface JudgmentSwaggerController {

    @Operation(summary = "심판 신청", description = "사용자가 특정 Sprint의 심판으로 신청합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "심판 신청 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @PostMapping("/judgments")
    ResponseEntity<JudgmentResponse> applyJudgment(@RequestBody JudgmentRequest request);


    @Operation(summary = "Sprint 심판 조회", description = "특정 Sprint의 심판을 조회합니다.")
    @GetMapping("/sprints/{sprintId}/judgment")
    ResponseEntity<JudgmentResponse> getJudgmentBySprint(@PathVariable Long sprintId);


    @Operation(summary = "심판 신청 취소", description = "사용자가 특정 Sprint의 심판 신청을 취소합니다.")
    @DeleteMapping("/sprints/{sprintId}/judgment")
    ResponseEntity<Void> cancelJudgment(@PathVariable Long sprintId);
}