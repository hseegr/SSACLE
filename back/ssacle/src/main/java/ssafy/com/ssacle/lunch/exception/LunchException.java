package ssafy.com.ssacle.lunch.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class LunchException extends SSACLEException {
    public LunchException(LunchErrorCode lunchErrorCode){
        super(lunchErrorCode);
    }
}
