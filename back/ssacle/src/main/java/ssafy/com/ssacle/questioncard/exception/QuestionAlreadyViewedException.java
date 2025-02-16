package ssafy.com.ssacle.questioncard.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class QuestionAlreadyViewedException extends SSACLEException {
    public QuestionAlreadyViewedException(){
        super(QuestionErrorCode.ALREADY_VIEWED_QUESTION);
    }
}
