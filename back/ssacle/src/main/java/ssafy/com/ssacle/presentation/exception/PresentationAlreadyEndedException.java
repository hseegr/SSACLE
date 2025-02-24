package ssafy.com.ssacle.presentation.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class PresentationAlreadyEndedException extends SSACLEException {
    public PresentationAlreadyEndedException() {
        super(PresentationErrorCode.PRESENTATION_ALREADY_ENDED);
    }
}
