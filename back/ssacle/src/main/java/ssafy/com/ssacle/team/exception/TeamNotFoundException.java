package ssafy.com.ssacle.team.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class TeamNotFoundException extends SSACLEException {
    public TeamNotFoundException(){
        super(TeamErrorCode.TEAM_NOT_FOUND);
    }
}
