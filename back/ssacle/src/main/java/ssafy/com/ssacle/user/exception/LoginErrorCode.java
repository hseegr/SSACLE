package ssafy.com.ssacle.user.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@AllArgsConstructor
public enum LoginErrorCode implements ErrorCode {
    // 로그인 관련 에러 (LOGIN_4XX)
    USER_NOT_FOUND(HttpStatus.BAD_REQUEST, "LOGIN_400_1", "User not found"),
    INVALID_PASSWORD(HttpStatus.BAD_REQUEST, "LOGIN_400_2", "Invalid password"),
    CANNOT_LOGIN(HttpStatus.FORBIDDEN, "LOGIN_403_1", "Cannot login due to restricted access"),
    ALREADY_LOGGED_IN(HttpStatus.FORBIDDEN, "LOGIN_409_2", "다른 화면에서 로그인했습니다. 다시 로그인해 주세요"),
    ALREADY_LOGGED_OUT(HttpStatus.UNAUTHORIZED, "LOGIN_401_2", "User is already logged out"),

    // Access Token 관련 에러 (TOKEN_ACCESS_401)
    ACCESS_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "TOKEN_ACCESS_401_1", "Access token has expired"),
    INVALID_ACCESS_TOKEN(HttpStatus.UNAUTHORIZED, "TOKEN_ACCESS_401_2", "Invalid access token"),

    // Refresh Token 관련 에러 (TOKEN_REFRESH_401)
    REFRESH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "TOKEN_REFRESH_401_1", "Refresh token has expired"),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "TOKEN_REFRESH_401_2", "Invalid refresh token"),
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.BAD_REQUEST, "TOKEN_REFRESH_400_1", "Refresh token not found");
    private final HttpStatus status;
    private final String code;
    private final String message;
}
