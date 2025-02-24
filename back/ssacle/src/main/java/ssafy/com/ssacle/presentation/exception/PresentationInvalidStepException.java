package ssafy.com.ssacle.presentation.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class PresentationInvalidStepException extends SSACLEException {
    public PresentationInvalidStepException() {
        super(PresentationErrorCode.PRESENTATION_INVALID_STEP);
    }
}
