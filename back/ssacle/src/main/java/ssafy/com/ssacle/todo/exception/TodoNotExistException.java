package ssafy.com.ssacle.todo.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class TodoNotExistException extends SSACLEException {
    public TodoNotExistException(){
        super(TodoErrorCode.TODO_NOT_EXIST);
    }
}

