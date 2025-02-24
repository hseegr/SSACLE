package ssafy.com.ssacle.video.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum VideoErrorCode implements ErrorCode {

    SESSION_CREATION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "V001", "OpenVidu 세션 생성 중 오류가 발생했습니다."),
    SESSION_NOT_FOUND(HttpStatus.NOT_FOUND, "V002", "해당 Sprint에 대한 세션이 존재하지 않습니다."),
    SESSION_CLOSURE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "V003", "OpenVidu 세션 종료 중 오류가 발생했습니다."),

    TOKEN_CREATION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "V004", "OpenVidu 토큰 생성 중 오류가 발생했습니다."),
    TOKEN_NOT_FOUND(HttpStatus.NOT_FOUND, "V005", "해당 세션에 대한 토큰이 존재하지 않습니다."),

    INVALID_SPRINT_ACCESS(HttpStatus.FORBIDDEN, "V006", "해당 Sprint에 참여할 권한이 없습니다."),
    INVALID_PRESENTATION_STEP(HttpStatus.BAD_REQUEST, "V007", "현재 발표 단계에서 세션을 생성할 수 없습니다."),

    REDIS_OPERATION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "V008", "Redis 연산 중 오류가 발생했습니다."),
    USER_TEAM_NOT_FOUND(HttpStatus.NOT_FOUND, "V009", "Sprint에 참여한 팀을 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
