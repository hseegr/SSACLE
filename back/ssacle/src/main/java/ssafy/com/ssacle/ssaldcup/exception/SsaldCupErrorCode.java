package ssafy.com.ssacle.ssaldcup.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum SsaldCupErrorCode implements ErrorCode {

    SSALDCUP_REQUIRED(HttpStatus.BAD_REQUEST, "SsaldCup_400_1", "팀을 생성하려면 싸드컵이 필요합니다."),
    SSALDCUP_NOT_EXIST(HttpStatus.BAD_REQUEST, "SsaldCup_404_2", "존재하지 않는 싸드컵입니다."),
    SSALDCUP_MAX_TEAMS_REACHED(HttpStatus.BAD_REQUEST, "SSALDCUP_003", "최대 참여 팀 수를 초과했습니다."),
    SSALDCUP_ALREADY_PARTICIPATED(HttpStatus.BAD_REQUEST, "SSALDCUP_004", "이미 싸드컵에 참가한 사용자입니다.");


    private final HttpStatus status;
    private final String code;
    private final String message;
}
