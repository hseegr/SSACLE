package ssafy.com.ssacle.questioncard.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum QuestionCardErrorCode implements ErrorCode {

    QUESTION_CARD_NOT_FOUND(HttpStatus.BAD_REQUEST, "QUESTION_CARD_400_1", "질문을 찾을수 없습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
