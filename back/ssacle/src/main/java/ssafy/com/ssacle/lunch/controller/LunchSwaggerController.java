package ssafy.com.ssacle.lunch.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ssafy.com.ssacle.board.domain.Board;
import ssafy.com.ssacle.lunch.dto.LunchResponseDTO;

import java.util.List;

@Tag(name = "Lunch API", description = "싸밥 관련 API입니다.")
public interface LunchSwaggerController {

    @Operation(summary = "금일 싸밥 조회", description = "금일 싸밥을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "싸밥 조회 성공", content = @Content(schema = @Schema(implementation = Board.class))),
            @ApiResponse(responseCode = "404", description = "싸밥을 찾을 수 없음", content = @Content)
    })
    @GetMapping
    ResponseEntity<List<LunchResponseDTO>> getBoardById();
}
