package ssafy.com.ssacle.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum GlobalErrorCode implements ErrorCode {
    VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "GLOABL_400_1", "Invalid data provided"),

    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "GLOBAL_500_1", "Unexpected error in internal server has occurred."),

    S3_OPERATION_FAILED(HttpStatus.BAD_REQUEST, "S3_400_1", "S3 operation failed."),
    S3_FILE_NOT_FOUND(HttpStatus.BAD_REQUEST, "S3_400_2", "S3 file not found."),
    S3_UNEXPECTED_ERROR(HttpStatus.BAD_REQUEST, "S3_400_3", "Unexpected error occurred during S3 operation."),
    ;
    private final HttpStatus status;
    private final String code;
    private final String message;
}
