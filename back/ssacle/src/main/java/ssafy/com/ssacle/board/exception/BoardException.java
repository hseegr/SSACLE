package ssafy.com.ssacle.board.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class BoardException extends SSACLEException {
    public BoardException(BoardErrorCode boardErrorCode) {
        super(boardErrorCode);
    }
}
