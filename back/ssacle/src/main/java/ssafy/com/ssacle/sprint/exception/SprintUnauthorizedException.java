package ssafy.com.ssacle.sprint.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class SprintUnauthorizedException extends SSACLEException {
    public SprintUnauthorizedException(){
        super(SprintErrorCode.SPRINT_UNAUTHORIZED);
    }
}

