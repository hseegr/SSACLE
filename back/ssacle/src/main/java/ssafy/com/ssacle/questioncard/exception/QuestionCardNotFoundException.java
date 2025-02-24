package ssafy.com.ssacle.questioncard.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class QuestionCardNotFoundException extends SSACLEException {
    public QuestionCardNotFoundException(){
        super(QuestionCardErrorCode.QUESTION_CARD_NOT_FOUND);
    }
}
