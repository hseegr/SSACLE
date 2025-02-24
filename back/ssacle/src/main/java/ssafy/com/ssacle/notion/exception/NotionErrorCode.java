package ssafy.com.ssacle.notion.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum NotionErrorCode implements ErrorCode {

    NOTION_CREATE_PAGE_ERROR(HttpStatus.BAD_REQUEST, "Notion_400_1", "노션 페이지 생성에 실패했습니다.");


    private final HttpStatus status;
    private final String code;
    private final String message;
}
