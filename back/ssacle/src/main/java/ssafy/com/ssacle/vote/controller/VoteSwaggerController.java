package ssafy.com.ssacle.vote.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import ssafy.com.ssacle.vote.dto.VoteRequestDTO;
import ssafy.com.ssacle.vote.dto.VoteResponseDTO;

@Tag(name = "Vote API", description = "투표 관련 API입니다.")
public interface VoteSwaggerController {

    @Operation(summary = "점심 메뉴 투표", description = "사용자가 특정 점심 메뉴에 투표합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "투표 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 (사용자/메뉴 없음)"),
            @ApiResponse(responseCode = "409", description = "이미 투표한 사용자")
    })
    @PostMapping
    ResponseEntity<VoteResponseDTO> castVote(
            @RequestBody VoteRequestDTO voteRequest
    );
}
