package ssafy.com.ssacle.todo.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class TodoDateNotExistException extends SSACLEException {
    public TodoDateNotExistException(){
        super(TodoErrorCode.TODO_DATE_REQUIRED);
    }
}
