package ssafy.com.ssacle.diary.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class DiaryNotExistException extends SSACLEException {
  public DiaryNotExistException(){ super(DiaryErrorCode.DIARY_NOT_FOUND); }
}
