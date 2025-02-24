package ssafy.com.ssacle.notion.exception;

import ssafy.com.ssacle.global.exception.SSACLEException;

public class NotionCreatePageException extends SSACLEException {
    public NotionCreatePageException(){
        super(NotionErrorCode.NOTION_CREATE_PAGE_ERROR);
    }
}
