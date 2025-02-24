package ssafy.com.ssacle.comment.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@AllArgsConstructor
public enum CommentErrorCode implements ErrorCode {

    /** 📌 1. 댓글 조회 관련 에러 */
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMENT_001", "해당 댓글을 찾을 수 없습니다."),
    PARENT_COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMENT_002", "부모 댓글을 찾을 수 없습니다."),

    /** 📌 2. 댓글 작성 관련 에러 */
    COMMENT_CREATION_FORBIDDEN(HttpStatus.FORBIDDEN, "COMMENT_003", "댓글을 작성할 권한이 없습니다."),
    COMMENT_CONTENT_EMPTY(HttpStatus.BAD_REQUEST, "COMMENT_004", "댓글 내용이 비어있습니다."),
    COMMENT_CONTENT_TOO_LONG(HttpStatus.BAD_REQUEST, "COMMENT_005", "댓글 내용은 255자를 초과할 수 없습니다."),

    /** 📌 3. 댓글 수정 관련 에러 */
    COMMENT_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "COMMENT_006", "댓글을 수정할 권한이 없습니다."),
    COMMENT_ALREADY_DELETED(HttpStatus.GONE, "COMMENT_007", "이미 삭제된 댓글입니다."),

    /** 📌 4. 댓글 삭제 관련 에러 */
    COMMENT_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "COMMENT_008", "댓글을 삭제할 권한이 없습니다."),
    COMMENT_HAS_CHILDREN(HttpStatus.BAD_REQUEST, "COMMENT_009", "대댓글이 존재하는 댓글은 삭제할 수 없습니다."),

    /** 📌 5. 기타 오류 */
    BOARD_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMENT_010", "해당 댓글이 속한 게시글을 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
