package ssafy.com.ssacle.ssaldcup.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class SsaldCupAlreadyParticipateException extends SSACLEException {
    public SsaldCupAlreadyParticipateException(){
        super(SsaldCupErrorCode.SSALDCUP_ALREADY_PARTICIPATED);
    }
}
