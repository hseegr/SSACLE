package ssafy.com.ssacle.category.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class TopCategoryNotFoundException extends SSACLEException {
    public TopCategoryNotFoundException() {
        super(CategoryErrorCode.TOP_CATEGORY_NOT_FOUND);
    }
}
