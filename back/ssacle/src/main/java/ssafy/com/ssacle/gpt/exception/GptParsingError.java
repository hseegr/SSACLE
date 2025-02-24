package ssafy.com.ssacle.gpt.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class GptParsingError extends SSACLEException {
    public GptParsingError(){
        super(GptErrorCode.GPT_PARSING_FAILED);
    }
}
