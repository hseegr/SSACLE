package ssafy.com.ssacle.sprint.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class InvalidPresentationStatusException extends SSACLEException {
    public InvalidPresentationStatusException(){
        super(SprintErrorCode.INVALID_PRESENTATION_STATUS);
    }
}
