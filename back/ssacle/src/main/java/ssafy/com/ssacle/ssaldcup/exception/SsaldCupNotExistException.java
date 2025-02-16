package ssafy.com.ssacle.ssaldcup.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class SsaldCupNotExistException extends SSACLEException {
    public SsaldCupNotExistException(){
        super(SsaldCupErrorCode.SSALDCUP_NOT_EXIST);
    }
}
