package ssafy.com.ssacle.category.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import ssafy.com.ssacle.global.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum CategoryErrorCode implements ErrorCode {

    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "CATEGORY_001", "해당 카테고리를 찾을 수 없습니다."),
    DUPLICATE_CATEGORY(HttpStatus.CONFLICT, "CATEGORY_002", "이미 존재하는 카테리 입니다."),
    INVALID_CATEGORY_SELECTION(HttpStatus.BAD_REQUEST, "CATEGORY_003", "선택한 카테고리가 유효하지 않습니다."),
    CATEGORY_CANNOT_BE_DELETED(HttpStatus.FORBIDDEN, "CATEGORY_004", "삭제할 수 없는 카테고리입니다."),
    CATEGORY_UPDATE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "CATEGORY_005", "카테고리 업데이트에 실패했습니다."),
    PARENT_CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "CATEGORY_006", "상위 카테고리를 찾을 수 없습니다."),
    CATEGORY_HAS_CHILDREN(HttpStatus.BAD_REQUEST, "CATEGORY_007", "하위 카테고리가 존재하여 삭제할 수 없습니다."),
    CATEGORY_ACCESS_DENIED(HttpStatus.FORBIDDEN, "CATEGORY_008", "해당 카테고리에 접근할 수 있는 권한이 없습니다."),
    CATEGORY_NOT_SELECTABLE(HttpStatus.BAD_REQUEST, "CATEGORY_009", "이 카테고리는 선택할 수 없습니다."),
    CATEGORY_VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "CATEGORY_010", "카테고리 데이터 검증에 실패했습니다."),
    FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "CATEGORY_011", "파일 업로드에 실패했습니다."),
    TOP_CATEGORY_NOT_FOUND(HttpStatus.BAD_REQUEST, "CATEGORY_400_1", "해당하는 최상위 카테고리가 존재하지 않습니다."),
    MIDDLE_CATEGORY_NOT_FOUND(HttpStatus.BAD_REQUEST, "CATEGORY_400_2", "해당하는 중간 카테고리가 존재하지 않습니다."),
    CATEGORY_NOT_EXIST(HttpStatus.BAD_REQUEST, "CATEGORY_400_3", "잘못된 데이터 입니다.");


    private final HttpStatus status;
    private final String code;
    private final String message;
}
