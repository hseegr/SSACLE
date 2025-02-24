package ssafy.com.ssacle.gpt.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import ssafy.com.ssacle.gpt.dto.GptFullResponse;

import java.time.LocalDateTime;

public interface GptSwaggerController {

    @Operation(summary = "GPT 기반 Todo 생성", description = "주어진 기간과 주제에 맞춰 GPT가 Todo 리스트를 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공적으로 Todo 리스트를 생성함"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @GetMapping("/todos")
    ResponseEntity<GptFullResponse> generateTodos(
            @Parameter(description = "학습 시작 날짜", example = "2025-02-08T13:31:11.893")
            @RequestParam LocalDateTime startAt,

            @Parameter(description = "학습 종료 날짜", example = "2025-02-15T13:31:11.893")
            @RequestParam LocalDateTime endAt,

            @Parameter(description = "학습 주제 (예: React, Spring)", example = "React")
            @RequestParam String topic
    );
}
