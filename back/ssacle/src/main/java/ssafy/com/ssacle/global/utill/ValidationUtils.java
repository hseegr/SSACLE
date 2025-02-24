package ssafy.com.ssacle.global.utill;

import ssafy.com.ssacle.global.exception.ErrorCode;
import ssafy.com.ssacle.global.exception.ValidationException;

public class ValidationUtils {
    private ValidationUtils(){}

    public static void validationCount(Integer count, ErrorCode errorCode) {
        if (count == null || count < 0 || count > 255) {
            throw new ValidationException(errorCode);
        }
    }
}
