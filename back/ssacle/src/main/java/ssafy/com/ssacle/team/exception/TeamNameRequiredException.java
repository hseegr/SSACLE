package ssafy.com.ssacle.team.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class TeamNameRequiredException extends SSACLEException {
    public TeamNameRequiredException(){
        super(TeamErrorCode.TEAM_NAME_REQUIRED);
    }
}
