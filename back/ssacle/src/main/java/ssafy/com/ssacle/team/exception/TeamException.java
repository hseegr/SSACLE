package ssafy.com.ssacle.team.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class TeamException extends SSACLEException {
    public TeamException(TeamErrorCode teamErrorCode){
        super(teamErrorCode);
    }
}
