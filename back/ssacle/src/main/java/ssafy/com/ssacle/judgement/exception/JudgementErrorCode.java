package ssafy.com.ssacle.judgement.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum JudgementErrorCode implements ErrorCode {
    JUDGEMENT_ALREADY_EXISTS(HttpStatus.CONFLICT, "JUDGEMENT_002", "이미 심판이 지정된 스프린트입니다."),
    JUDGEMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "JUDGEMENT_003", "해당 스프린트에 심판이 없습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;

}
