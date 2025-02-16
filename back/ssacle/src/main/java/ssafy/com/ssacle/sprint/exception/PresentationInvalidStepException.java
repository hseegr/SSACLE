package ssafy.com.ssacle.sprint.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class PresentationInvalidStepException extends SSACLEException {
    public PresentationInvalidStepException() {
        super(SprintErrorCode.PRESENTATION_INVALID_STEP);
    }
}
