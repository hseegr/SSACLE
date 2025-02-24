package ssafy.com.ssacle.team.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class TeamNameExistException extends SSACLEException {
    public TeamNameExistException(){
        super(TeamErrorCode.TEAM_NAME_EXIST);
    }
}
