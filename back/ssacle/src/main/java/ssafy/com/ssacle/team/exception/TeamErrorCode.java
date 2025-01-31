package ssafy.com.ssacle.team.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@AllArgsConstructor
public enum TeamErrorCode implements ErrorCode {
    TEAM_NOT_FOUND(HttpStatus.NOT_FOUND, "TEAM_001", "해당 팀이 존재하지 않습니다."),
    TEAM_FULL(HttpStatus.BAD_REQUEST, "TEAM_002", "팀의 모집 인원이 가득 찼습니다."),
    USER_ALREADY_IN_TEAM(HttpStatus.CONFLICT, "TEAM_003", "사용자가 이미 해당 팀에 속해 있습니다."),
    USER_NOT_IN_TEAM(HttpStatus.BAD_REQUEST, "TEAM_004", "사용자가 해당 팀에 속해 있지 않습니다."),
    TEAM_NAME_DUPLICATE(HttpStatus.CONFLICT, "TEAM_005", "이미 존재하는 팀 이름입니다."),
    TEAM_JOIN_FORBIDDEN(HttpStatus.FORBIDDEN, "TEAM_006", "해당 팀에 가입할 권한이 없습니다."),
    TEAM_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "TEAM_007", "팀을 삭제할 권한이 없습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
