package ssafy.com.ssacle.ssaldcup.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class SsaldCupRequiredException  extends SSACLEException {
    public SsaldCupRequiredException(){
        super(SsaldCupErrorCode.SSALDCUP_REQUIRED);
    }
}
