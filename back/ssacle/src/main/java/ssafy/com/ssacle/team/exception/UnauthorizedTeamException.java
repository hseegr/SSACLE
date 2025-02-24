package ssafy.com.ssacle.team.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class UnauthorizedTeamException extends SSACLEException {
    public UnauthorizedTeamException(){
        super(TeamErrorCode.UNAUTHORIZED_TEAM);
    }
}
