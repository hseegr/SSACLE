package ssafy.com.ssacle.user.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class CannotLoginException extends SSACLEException {
    public CannotLoginException(LoginErrorCode errorCode){
        super(errorCode);
    }
}
