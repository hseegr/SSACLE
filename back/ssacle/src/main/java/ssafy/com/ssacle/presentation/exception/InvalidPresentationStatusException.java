package ssafy.com.ssacle.presentation.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class InvalidPresentationStatusException extends SSACLEException {
    public InvalidPresentationStatusException(){
        super(PresentationErrorCode.INVALID_PRESENTATION_STATUS);
    }
}
