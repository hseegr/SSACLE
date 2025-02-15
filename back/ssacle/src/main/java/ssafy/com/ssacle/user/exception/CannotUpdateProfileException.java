package ssafy.com.ssacle.user.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class CannotUpdateProfileException extends SSACLEException {
    public CannotUpdateProfileException(UpdateProfileErrorCode errorCode){
        super(errorCode);
    }
}
