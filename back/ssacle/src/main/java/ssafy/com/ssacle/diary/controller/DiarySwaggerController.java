package ssafy.com.ssacle.diary.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.diary.dto.DiaryDetailResponse;
import ssafy.com.ssacle.diary.dto.DiaryGroupedByDateResponse;

import java.util.List;

@Tag(name = "Diary API", description = "팀의 Notion 페이지에서 가져온 일기 데이터를 관리하는 API입니다.")
@RequestMapping("/api/diary")
public interface DiarySwaggerController {

    @Operation(summary = "스프린트의 모든 다이어리 조회", description = "특정 스프린트 ID에 해당하는 모든 팀의 다이어리를 날짜순으로 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "다이어리 목록 조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터", content = @Content),
            @ApiResponse(responseCode = "404", description = "해당 스프린트를 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @GetMapping("/{sprintId}")
    ResponseEntity<List<DiaryGroupedByDateResponse>> getDiariesBySprint(
            @Parameter(description = "조회할 Sprint ID", example = "1") @PathVariable Long sprintId
    );

    @Operation(summary = "즉시 다이어리 생성", description = "테스트 용도로 즉시 status=1인 팀들의 다이어리를 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "다이어리 생성 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생")
    })
    @PostMapping("/generate-now")
    ResponseEntity<String> generateDailyDiariesNow();

    @Operation(summary = "다이어리 상세 조회", description = "특정 다이어리 ID로 다이어리를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "다이어리 조회 성공"),
            @ApiResponse(responseCode = "404", description = "해당 다이어리를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생")
    })
    @GetMapping("/detail/{diaryId}")
    ResponseEntity<DiaryDetailResponse> getDiaryById(
            @Parameter(description = "조회할 Diary ID", example = "101") @PathVariable Long diaryId
    );
}
