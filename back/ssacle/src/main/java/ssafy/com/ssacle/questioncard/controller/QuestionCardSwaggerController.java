package ssafy.com.ssacle.questioncard.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.questioncard.dto.QuestionCardRequest;
import ssafy.com.ssacle.questioncard.dto.QuestionCardResponse;

import java.util.List;

@Tag(name = "QuestionCard API", description = "QuestionCard 관련 API")
public interface QuestionCardSwaggerController {

    @Operation(summary = "QuestionCard 생성", description = "새로운 QuestionCard를 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @PostMapping("/question-cards")
    ResponseEntity<QuestionCardResponse> createQuestionCard(@RequestBody QuestionCardRequest request);


    @Operation(summary = "Sprint 별 QuestionCard 조회", description = "특정 Sprint에 속한 모든 QuestionCard를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터", content = @Content),
            @ApiResponse(responseCode = "404", description = "Sprint를 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @GetMapping("/sprints/{sprintId}/question-cards")
    ResponseEntity<List<QuestionCardResponse>> getQuestionCardsBySprint(@PathVariable Long sprintId);


    @Operation(summary = "QuestionCard 수정", description = "특정 QuestionCard의 내용을 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "404", description = "해당 QuestionCard를 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @PutMapping("/question-cards/{id}")
    ResponseEntity<QuestionCardResponse> updateQuestionCard(@PathVariable Long id, @RequestBody QuestionCardRequest request);


    @Operation(summary = "QuestionCard 삭제", description = "특정 QuestionCard를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "삭제 성공"),
            @ApiResponse(responseCode = "404", description = "해당 QuestionCard를 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @DeleteMapping("/question-cards/{id}")
    ResponseEntity<Void> deleteQuestionCard(@PathVariable Long id);

    @Operation(summary = "특정 QuestionCard 조회", description = "특정 Sprint에 속한 사용자가 선택한QuestionCard를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터", content = @Content),
            @ApiResponse(responseCode = "404", description = "Sprint를 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @GetMapping("/sprints/{sprintId}/question-cards/{questionId}")
    ResponseEntity<QuestionCardResponse> selectQuestionCardsBySprintAndQuestionId(@PathVariable Long sprintId, @PathVariable("questionId") Long questionId);

}

