package ssafy.com.ssacle.user.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class PickleNotEnoughException extends SSACLEException {
    public PickleNotEnoughException(UpdateProfileErrorCode errorCode){
        super(errorCode);
    }
}
