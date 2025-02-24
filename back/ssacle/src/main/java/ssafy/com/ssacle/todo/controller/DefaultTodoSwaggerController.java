package ssafy.com.ssacle.todo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ssafy.com.ssacle.todo.dto.DefaultTodoResponse;

import java.util.List;

/**
 * DefaultTodo API 명세
 */
@Tag(name = "DefaultTodo API", description = "DefaultTodo 관련 API입니다.")
public interface DefaultTodoSwaggerController {

    @Operation(summary = "스프린트별 기본 할 일 목록 조회", description = "특정 스프린트에 포함된 기본 할 일을 날짜별로 정렬하여 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공적으로 기본 할 일 목록을 반환"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터", content = @Content),
            @ApiResponse(responseCode = "404", description = "해당 스프린트를 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @Parameters(value = {
            @Parameter(name = "sprintId", description = "조회할 스프린트의 ID", example = "1")
    })
    @GetMapping("/sprint/{sprintId}/default-todos")
    ResponseEntity<List<DefaultTodoResponse>> getDefaultTodosBySprintId(@PathVariable Long sprintId);
}
