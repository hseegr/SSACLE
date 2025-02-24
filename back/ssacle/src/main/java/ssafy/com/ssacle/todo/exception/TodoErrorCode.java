package ssafy.com.ssacle.todo.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum TodoErrorCode implements ErrorCode {

    TODO_DATE_REQUIRED(HttpStatus.BAD_REQUEST, "Todo_400_1", "투두 날짜가 존재하지 않습니다."),
    TODO_NOT_EXIST(HttpStatus.BAD_REQUEST, "Todo_400_2", "투두 데이터가 없습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
