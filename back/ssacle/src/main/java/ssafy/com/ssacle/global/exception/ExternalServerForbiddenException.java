package ssafy.com.ssacle.global.exception;

public class ExternalServerForbiddenException extends SSACLEException {
    public ExternalServerForbiddenException(ErrorCode errorCode) {
        super(errorCode);
    }
}
