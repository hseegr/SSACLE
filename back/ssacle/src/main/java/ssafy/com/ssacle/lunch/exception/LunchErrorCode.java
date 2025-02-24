package ssafy.com.ssacle.lunch.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@AllArgsConstructor
public enum LunchErrorCode implements ErrorCode {

    NO_LUNCH_FOUND(HttpStatus.NOT_FOUND, "LUNCH_001", "오늘의 점심 메뉴가 존재하지 않습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
