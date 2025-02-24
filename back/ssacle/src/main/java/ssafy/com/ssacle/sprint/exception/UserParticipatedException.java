package ssafy.com.ssacle.sprint.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class UserParticipatedException extends SSACLEException {
    public UserParticipatedException(){
        super(SprintErrorCode.USER_PARTICIPATED);
    }
}

