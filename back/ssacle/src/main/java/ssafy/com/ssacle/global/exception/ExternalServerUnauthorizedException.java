package ssafy.com.ssacle.global.exception;

public class ExternalServerUnauthorizedException extends SSACLEException {
    public ExternalServerUnauthorizedException(ErrorCode errorCode) {
        super(errorCode);
    }
}
