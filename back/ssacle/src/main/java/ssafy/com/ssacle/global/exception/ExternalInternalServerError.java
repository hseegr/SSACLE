package ssafy.com.ssacle.global.exception;

public class ExternalInternalServerError extends SSACLEException {
    public ExternalInternalServerError(ErrorCode errorCode) {
        super(errorCode);
    }
}
