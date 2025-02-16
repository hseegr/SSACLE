package ssafy.com.ssacle.questioncard.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum QuestionErrorCode implements ErrorCode {
    ALREADY_VIEWED_QUESTION(HttpStatus.BAD_REQUEST, "Q001", "이미 열람한 질문 카드는 다시 열람할 수 없습니다."),
    QUESTION_NOT_FOUND(HttpStatus.NOT_FOUND, "Q002", "해당 질문 카드를 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
