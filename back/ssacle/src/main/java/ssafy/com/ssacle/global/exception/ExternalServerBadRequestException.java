package ssafy.com.ssacle.global.exception;

public class ExternalServerBadRequestException extends SSACLEException {
    public ExternalServerBadRequestException(ErrorCode errorCode) {
        super(errorCode);
    }
}
