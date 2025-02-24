package ssafy.com.ssacle.global.exception;

public class ValidationException extends SSACLEException{
    public ValidationException(ErrorCode errorCode){super(errorCode);}
}
