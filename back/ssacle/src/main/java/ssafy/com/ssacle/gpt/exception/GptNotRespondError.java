package ssafy.com.ssacle.gpt.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class GptNotRespondError extends SSACLEException {
    public GptNotRespondError(){
        super(GptErrorCode.GPT_NOT_RESPOND);
    }
}

