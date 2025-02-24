package ssafy.com.ssacle.board.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@AllArgsConstructor
public enum BoardErrorCode implements ErrorCode {

    /** 📌 1. 게시글을 찾을 수 없는 경우 */
    BOARD_NOT_FOUND(HttpStatus.NOT_FOUND, "BOARD_001", "해당 게시글을 찾을 수 없습니다."),

    /** 📌 2. 게시글 생성 시 로그인하지 않은 경우 */
    BOARD_CREATE_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "BOARD_002", "로그인이 필요한 기능입니다."),

    /** 📌 3. 권한 없는 사용자가 게시글을 수정하려는 경우 */
    BOARD_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "BOARD_003", "게시글을 수정할 권한이 없습니다."),

    /** 📌 4. 게시글 삭제 시, 작성자가 아닌 경우 */
    BOARD_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "BOARD_004", "게시글을 삭제할 권한이 없습니다."),

    /** 📌 5. 게시글 삭제 시, 이미 삭제된 게시글인 경우 */
    BOARD_ALREADY_DELETED(HttpStatus.BAD_REQUEST, "BOARD_005", "이미 삭제된 게시글입니다."),

    /** 📌 6. 게시글 제목이 비어 있는 경우 */
    BOARD_TITLE_EMPTY(HttpStatus.BAD_REQUEST, "BOARD_006", "게시글 제목은 필수 입력 사항입니다."),

    /** 📌 7. 게시글 내용이 비어 있는 경우 */
    BOARD_CONTENT_EMPTY(HttpStatus.BAD_REQUEST, "BOARD_007", "게시글 내용은 필수 입력 사항입니다."),

    /** 📌 7. 게시글 태그가 비어 있는 경우 */
    BOARD_TAG_EMPTY(HttpStatus.BAD_REQUEST, "BOARD_008", "태그는 필수 입력 사항입니다."),

    /** 📌 9. 게시판 타입이 잘못된 경우 */
    INVALID_BOARD_TYPE(HttpStatus.BAD_REQUEST, "BOARD_009", "잘못된 게시판 타입입니다."),

    /** 📌 10. 게시판 접근 제한 */
    BOARD_ACCESS_DENIED(HttpStatus.FORBIDDEN, "BOARD_010", "해당 게시판에 접근할 수 없습니다."),

    /** 📌 11. 게시글 생성 중 서버 오류 */
    BOARD_CREATE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "BOARD_011", "게시글 생성 중 오류가 발생했습니다."),

    /** 📌 12. 게시글 수정 중 서버 오류 */
    BOARD_UPDATE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "BOARD_012", "게시글 수정 중 오류가 발생했습니다."),

    /** 📌 13. 게시글 삭제 중 서버 오류 */
    BOARD_DELETE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "BOARD_013", "게시글 삭제 중 오류가 발생했습니다."),

    /** 📌 14. 게시글 타입을 찾을 수 없는 경우 */
    BOARDTYPE_NOT_FOUND(HttpStatus.NOT_FOUND, "BOARD_014", "해당 게시글 타입을 찾을 수 없습니다."),

    /** 📌 15. 이미 해당 게시물을 구입한 경우 */
    BOARD_ALREADY_PURCHASED(HttpStatus.NOT_FOUND, "BOARD_015", "해당 게시글을 이미 구입하셨습니다."),

    /** 피클 부족 한 경우 */
    PICKLE_NOT_ENOUGH(HttpStatus.FORBIDDEN, "BOARD_016", "피클이 부족합니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
