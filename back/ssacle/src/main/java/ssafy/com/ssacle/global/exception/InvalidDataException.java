package ssafy.com.ssacle.global.exception;

public class InvalidDataException extends SSACLEException {
    public InvalidDataException(ErrorCode errorCode) {
        super(errorCode);
    }
}
