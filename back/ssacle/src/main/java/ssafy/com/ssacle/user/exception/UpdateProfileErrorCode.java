package ssafy.com.ssacle.user.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@AllArgsConstructor
public enum UpdateProfileErrorCode implements ErrorCode {

    // 기존 프로필 업데이트 관련 에러 코드
    INVALID_FILE_FORMAT(HttpStatus.BAD_REQUEST, "PROFILE_001", "잘못된 파일 형식입니다."),
    FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "PROFILE_002", "파일 업로드에 실패했습니다."),
    NICKNAME_ALREADY_EXISTS(HttpStatus.CONFLICT, "PROFILE_003", "이미 존재하는 닉네임입니다."),
    PROFILE_UPDATE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "PROFILE_004", "프로필 업데이트에 실패했습니다."),

    // ✅ 비밀번호 변경 관련 에러 코드 추가
    INCORRECT_CURRENT_PASSWORD(HttpStatus.UNAUTHORIZED, "PROFILE_006", "현재 비밀번호가 올바르지 않습니다."),
    PASSWORD_CONFIRMATION_MISMATCH(HttpStatus.BAD_REQUEST, "PROFILE_007", "새로운 비밀번호와 확인 비밀번호가 일치하지 않습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
