package ssafy.com.ssacle.global.exception;

public class ExternalServerTooManyRequestsException extends SSACLEException {
    public ExternalServerTooManyRequestsException(ErrorCode errorCode) {
        super(errorCode);
    }
}

