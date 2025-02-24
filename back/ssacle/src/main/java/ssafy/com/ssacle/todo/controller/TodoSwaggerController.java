package ssafy.com.ssacle.todo.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.gpt.dto.TodoResponse;
import ssafy.com.ssacle.todo.dto.TodoCreateRequest;
import ssafy.com.ssacle.todo.dto.TodoResponseDTO;

import java.util.List;

@Tag(name = "Todo API", description = "할 일(Todo) 관련 API입니다.")
@RequestMapping("/api/v1/todos")
public interface TodoSwaggerController {

    @Operation(summary = "팀 ID로 Todo 조회", description = "특정 팀에 속한 Todo 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Todo 목록 조회 성공"),
            @ApiResponse(responseCode = "404", description = "해당 팀을 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @GetMapping("/team/{teamId}")
    ResponseEntity<List<TodoResponse>> getTodoByTeamId(
            @Parameter(description = "조회할 팀 ID", example = "1") @PathVariable Long teamId);

    @Operation(summary = "Todo 완료 상태 변경", description = "특정 Todo의 완료 여부(isDone)를 변경합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Todo 상태 변경 성공"),
            @ApiResponse(responseCode = "404", description = "해당 Todo를 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @PatchMapping("/{todoId}/done")
    ResponseEntity<Void> updateTodoStatus(
            @Parameter(description = "변경할 Todo ID", example = "1") @PathVariable Long todoId);

    @Operation(summary = "Todo 삭제", description = "특정 Todo를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Todo 삭제 성공"),
            @ApiResponse(responseCode = "404", description = "해당 Todo를 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @DeleteMapping("/{todoId}")
    ResponseEntity<Void> deleteTodo(
            @Parameter(description = "삭제할 Todo ID", example = "1") @PathVariable Long todoId);

    @Operation(summary = "새로운 Todo 추가", description = "특정 팀에 새로운 Todo를 추가합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Todo 추가 성공"),
            @ApiResponse(responseCode = "404", description = "해당 팀을 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @PostMapping("/team/{teamId}")
    ResponseEntity<TodoResponseDTO> createTodo(
            @Parameter(description = "Todo를 추가할 팀 ID", example = "1") @PathVariable Long teamId,
            @RequestBody TodoCreateRequest request);
}
