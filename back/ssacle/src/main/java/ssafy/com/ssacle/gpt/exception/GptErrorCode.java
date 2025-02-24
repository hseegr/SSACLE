package ssafy.com.ssacle.gpt.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum GptErrorCode implements ErrorCode {

    GPT_NOT_RESPOND(HttpStatus.BAD_REQUEST, "Gpt_400_1", "GPT 응답이 비어 있음."),
    GPT_PARSING_FAILED(HttpStatus.BAD_REQUEST, "Gpt_401_2", "GPT 응답 파싱 실패.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
