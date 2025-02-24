package ssafy.com.ssacle.vote.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class VoteException extends SSACLEException {
    public VoteException(VoteErrorCode voteErrorCode){
        super(voteErrorCode);
    }
}
