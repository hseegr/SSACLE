package ssafy.com.ssacle.video.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class VideoException extends SSACLEException {
    public VideoException(VideoErrorCode videoErrorCode){
        super(videoErrorCode);
    }
}
