package ssafy.com.ssacle.ssaldcup.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class SsaldCupMaxTeamReachException extends SSACLEException {
    public SsaldCupMaxTeamReachException(){
        super(SsaldCupErrorCode.SSALDCUP_MAX_TEAMS_REACHED);
    }
}
