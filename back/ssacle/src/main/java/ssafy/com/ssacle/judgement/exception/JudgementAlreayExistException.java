package ssafy.com.ssacle.judgement.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class JudgementAlreayExistException extends SSACLEException {
    public JudgementAlreayExistException(){
        super(JudgementErrorCode.JUDGEMENT_ALREADY_EXISTS);
    }
}
