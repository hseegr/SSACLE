package ssafy.com.ssacle.user.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@AllArgsConstructor
public enum JoinErrorCode implements ErrorCode {
    JOIN_CANNOT(HttpStatus.BAD_REQUEST,"JOIN_400_1", "Cannot Join"),
    INVALID_EMAIL_FORMAT(HttpStatus.BAD_REQUEST, "JOIN_400_2", "Invalid email format"),
    DUPLICATE_STUDENTNUMBER(HttpStatus.CONFLICT, "JOIN_409_1", "Student Number already exists"),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "JOIN_409_2", "Email already exists"),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "JOIN_409_3", "Nickname already exists"),
    PASSWORD_MISMATCH(HttpStatus.BAD_REQUEST, "JOIN_400_3", "Passwords do not match"),
    JOIN_PROCESS_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "JOIN_500_1", "Join process failed"),
    INVALID_VERIFICATION_CODE(HttpStatus.UNAUTHORIZED, "JOIN_401_1", "Invalid or expired verification code"),
    UNVERIFIED_EMAIL(HttpStatus.FORBIDDEN, "JOIN_403_1", "Email verification required");


    private final HttpStatus status;
    private final String code;
    private final String message;
}
