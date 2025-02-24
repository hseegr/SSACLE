package ssafy.com.ssacle.team.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class UserRequiredException extends SSACLEException {
    public UserRequiredException(){
        super(TeamErrorCode.USER_REQUIRED);
    }
}
