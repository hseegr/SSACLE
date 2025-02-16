package ssafy.com.ssacle.sprint.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class PresentationAlreadyEndedException extends SSACLEException {
    public PresentationAlreadyEndedException() {
        super(SprintErrorCode.PRESENTATION_ALREADY_ENDED);
    }
}
