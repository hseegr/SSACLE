package ssafy.com.ssacle.team.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class UserNotInTeamException extends SSACLEException {
    public UserNotInTeamException(){
        super(TeamErrorCode.TEAM_UNAUTHORIZED);
    }
}
