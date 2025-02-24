package ssafy.com.ssacle.sprint.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class SprintNotExistException extends SSACLEException {
    public SprintNotExistException(){
        super(SprintErrorCode.SPRINT_NOT_EXIST);
    }
}

