package ssafy.com.ssacle.category.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class CategoryNotExistException extends SSACLEException {
    public CategoryNotExistException() {
        super(CategoryErrorCode.CATEGORY_NOT_EXIST);
    }
}
