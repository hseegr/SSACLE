package ssafy.com.ssacle.category.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class MiddleCategoryNotFoundException extends SSACLEException {
    public MiddleCategoryNotFoundException() {
        super(CategoryErrorCode.MIDDLE_CATEGORY_NOT_FOUND);
    }
}
