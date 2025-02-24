package ssafy.com.ssacle.comment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.comment.domain.Comment;
import ssafy.com.ssacle.comment.dto.CommentRequestDTO;
import ssafy.com.ssacle.comment.dto.CommentResponseDTO;

import java.util.List;

@Tag(name = "Comment API", description = "댓글 관련 API입니다.")
public interface CommentSwaggerController {

    /** 📌 1. 특정 게시글의 댓글 조회 */
    @Operation(summary = "특정 게시글의 댓글 조회", description = "게시글 ID를 기반으로 해당 게시글의 모든 댓글을 최신순으로 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글 조회 성공"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음", content = @Content(
                    examples = @ExampleObject(value = "{ \"code\": \"COMMENT_010\", \"message\": \"해당 댓글이 속한 게시글을 찾을 수 없습니다.\" }")
            ))
    })
    @GetMapping("/board/{boardId}")
    ResponseEntity<List<CommentResponseDTO>> getCommentsByBoard(@PathVariable Long boardId);

    /** 📌 2. 댓글 작성 */
    @Operation(summary = "댓글 작성", description = "게시글에 새로운 댓글을 작성합니다. (로그인 필요)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "댓글 작성 성공"),
            @ApiResponse(responseCode = "403", description = "댓글 작성 권한 없음"),
            @ApiResponse(responseCode = "404", description = "게시글을 찾을 수 없음"),
            @ApiResponse(responseCode = "400", description = "댓글 내용이 비어 있음")
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "댓글 작성 요청 데이터",
            required = true,
            content = @Content(
                    schema = @Schema(implementation = CommentRequestDTO.class),
                    examples = @ExampleObject(
                            name = "댓글 예제",
                            value = "{ \"content\": \"이것은 테스트 댓글입니다.\" }"
                    )
            )
    )
    @PostMapping("/board/{boardId}")
    ResponseEntity<Void> createComment(@PathVariable Long boardId,
                                       @RequestBody CommentRequestDTO commentRequestDTO
    );

    /** 📌 3. 댓글 수정 */
    @Operation(summary = "댓글 수정", description = "사용자가 작성한 댓글을 수정합니다. (로그인 필요)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "댓글 수정 성공"),
            @ApiResponse(responseCode = "403", description = "댓글 수정 권한 없음"),
            @ApiResponse(responseCode = "404", description = "댓글을 찾을 수 없음")
    })
    @PatchMapping("/{commentId}")
    ResponseEntity<Void> updateComment(@PathVariable Long commentId, @RequestBody CommentRequestDTO commentRequestDTO);

    /** 📌 4. 댓글 삭제 */
    @Operation(summary = "댓글 삭제", description = "사용자가 작성한 댓글을 삭제합니다. (로그인 필요)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "댓글 삭제 성공"),
            @ApiResponse(responseCode = "403", description = "댓글 삭제 권한 없음"),
            @ApiResponse(responseCode = "404", description = "댓글을 찾을 수 없음"),
            @ApiResponse(responseCode = "400", description = "대댓글이 있는 경우 삭제 불가")
    })
    @DeleteMapping("/{commentId}")
    ResponseEntity<Void> deleteComment(@PathVariable Long commentId);

    /** 📌 5. 대댓글 작성 */
    @Operation(summary = "대댓글 작성", description = "부모 댓글에 대한 대댓글을 작성합니다. (로그인 필요)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "대댓글 작성 성공"),
            @ApiResponse(responseCode = "403", description = "대댓글 작성 권한 없음"),
            @ApiResponse(responseCode = "404", description = "부모 댓글을 찾을 수 없음"),
            @ApiResponse(responseCode = "400", description = "댓글 내용이 비어 있음")
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "대댓글 작성 요청 데이터",
            required = true,
            content = @Content(
                    schema = @Schema(implementation = CommentRequestDTO.class),
                    examples = @ExampleObject(
                            name = "대댓글 예제",
                            value = "{ \"content\": \"이것은 대댓글입니다.\" }"
                    )
            )
    )
    @PostMapping("/reply/{parentCommentId}")
    ResponseEntity<Void> createReply(@PathVariable Long parentCommentId,
                                     @RequestBody CommentRequestDTO commentRequestDTO
    );

    /** 📌 6. 특정 댓글의 대댓글 조회 */
    @Operation(summary = "대댓글 조회", description = "부모 댓글 ID를 기반으로 해당 댓글의 모든 대댓글을 최신순으로 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "대댓글 조회 성공"),
            @ApiResponse(responseCode = "404", description = "부모 댓글을 찾을 수 없음")
    })
    @GetMapping("/reply/{parentCommentId}")
    ResponseEntity<List<CommentResponseDTO>> getReplies(@PathVariable Long parentCommentId);
}
