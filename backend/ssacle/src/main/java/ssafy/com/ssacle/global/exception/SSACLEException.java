package ssafy.com.ssacle.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SSACLEException extends RuntimeException{
    private ErrorCode errorCode;
}
