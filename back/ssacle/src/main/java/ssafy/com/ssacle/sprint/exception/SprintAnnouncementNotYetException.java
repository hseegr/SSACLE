package ssafy.com.ssacle.sprint.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class SprintAnnouncementNotYetException extends SSACLEException {
    public SprintAnnouncementNotYetException(){
        super(SprintErrorCode.SPRINT_ANNOUNCEMENT_NOT_YET);
    }
}
