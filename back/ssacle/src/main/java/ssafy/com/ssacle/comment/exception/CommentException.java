package ssafy.com.ssacle.comment.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class CommentException extends SSACLEException {
  public CommentException(CommentErrorCode commentErrorCode){ super(commentErrorCode); }
}
