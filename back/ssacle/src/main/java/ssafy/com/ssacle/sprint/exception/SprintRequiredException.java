package ssafy.com.ssacle.sprint.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class SprintRequiredException extends SSACLEException {
    public SprintRequiredException(){
        super(SprintErrorCode.SPRINT_REQUIRED);
    }
}
