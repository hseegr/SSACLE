package ssafy.com.ssacle.global.exception;

public class ExternalServerUnexpectedErrorException extends SSACLEException {
    public ExternalServerUnexpectedErrorException(ErrorCode errorCode) {
        super(errorCode);
    }
}
