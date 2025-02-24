package ssafy.com.ssacle.judgement.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class JudgementNotFoundException extends SSACLEException {
    public JudgementNotFoundException(){
        super(JudgementErrorCode.JUDGEMENT_NOT_FOUND);
    }
}
