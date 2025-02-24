package ssafy.com.ssacle.global.exception;

public class ExternalServerNotFoundException extends SSACLEException {
    public ExternalServerNotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }
}
