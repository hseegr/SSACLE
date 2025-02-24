package ssafy.com.ssacle.vote.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@AllArgsConstructor
public enum VoteErrorCode implements ErrorCode {
    ALREADY_VOTED(HttpStatus.BAD_REQUEST, "VOTE_001", "사용자는 오늘 이미 투표하였습니다."),
    USER_NOT_FOUND(HttpStatus.UNAUTHORIZED, "VOTE_002", "사용자 정보를 찾을 수 없습니다."),
    VOTE_SAVE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "VOTE_003", "투표 저장 중 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
