package ssafy.com.ssacle.category.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class CategoryException  extends SSACLEException {
    public CategoryException(CategoryErrorCode categoryErrorCode){
        super(categoryErrorCode);
    }
}
