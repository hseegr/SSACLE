package ssafy.com.ssacle.diary.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@AllArgsConstructor
public enum DiaryErrorCode implements ErrorCode {

    DIARY_NOT_FOUND(HttpStatus.NOT_FOUND, "Diary_400_1", "해당 다이어리를 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
