package ssafy.com.ssacle.sprint.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum SprintErrorCode implements ErrorCode {

    SPRINT_REQUIRED(HttpStatus.BAD_REQUEST, "Sprint_400_1", "팀을 생성하려면 스프린트가 필요합니다."),
    SPRINT_NOT_EXIST(HttpStatus.NOT_FOUND, "Sprint_404_2", "존재하지 않는 스프린트입니다."),
    SPRINT_ANNOUNCEMENT_NOT_YET(HttpStatus.FORBIDDEN, "Sprint_403_5", "아직 발표 시간이 되지 않았습니다."),
    SPRINT_UNAUTHORIZED(HttpStatus.FORBIDDEN, "Sprint_403", "사용자가 해당 스프린트에 참여하고 있지 않습니다."),
    USER_PARTICIPATED(HttpStatus.FORBIDDEN, "Sprint_403_6", "사용자가 해당 스프린트에 이미 참여했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
