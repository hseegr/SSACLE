package ssafy.com.ssacle.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.user.dto.*;

@Tag(name = "Join API", description = "회원가입 API입니다.")
public interface JoinSwaggerController {

    @Operation(summary = "이메일 인증 코드 전송", description = "입력한 이메일로 인증 코드를 전송합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 코드가 이메일로 전송되었습니다."),
            @ApiResponse(responseCode = "400", description = "잘못된 이메일 형식입니다.", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "이메일 인증 요청 데이터",
            required = true,
            content = @Content(
                    schema = @Schema(implementation = VerificationRequestDTO.class),
                    examples = @ExampleObject(
                            name = "이메일 인증 요청 예제",
                            value = "{ \"email\": \"spancer1@naver.com\", \"webhook\": \"https://meeting.ssafy.com/hooks/wnkxsfwyupbf3yxk5jdq94ke3r\" }"
                    )
            )
    )
    @PostMapping("/send-verification")
    ResponseEntity<String> sendVerificationCode(
            @RequestBody VerificationRequestDTO request
    );


    @Operation(summary = "인증번호 검증", description = "사용자가 입력한 인증번호를 검증합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 인증 코드이거나 만료된 코드입니다.", content = @Content),
            @ApiResponse(responseCode = "404", description = "해당 이메일로 전송된 인증 코드가 없습니다.", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "인증 코드 검증 요청 데이터",
            required = true,
            content = @Content(
                    schema = @Schema(implementation = VerificationCodeDTO.class),
                    examples = @ExampleObject(
                            name = "인증 코드 검증 요청 예제",
                            value = "{ \"email\": \"spancer1@naver.com\", \"verificationCode\": \"123456\" }"
                    )
            )
    )
    @PostMapping("/verify-ssafy")
    ResponseEntity<String> verifyCode(
            @RequestBody VerificationCodeDTO request
    );

    @Operation(summary = "회원 가입", description = "회원을 등록합니다.")
    @ApiResponse(responseCode = "201", description = "회원 가입에 성공하였습니다.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "회원 가입 요청 데이터",
            required = true,
            content = @Content(
                    schema = @Schema(implementation = JoinRequestDTO.class),
                    examples = @ExampleObject(
                            name = "회원 가입 예제",
                            value = "{ \"studentNumber\": \"1240587\", \"email\": \"spancer1@naver.com\", \"nickname\": \"KSH0610\", \"name\": \"김수현\", \"password\": \"rlatngus@1\", \"confirmpassword\": \"rlatngus@1\" }"
                    )
            )
    )
    @PostMapping
    ResponseEntity<JoinResponseDTO> createUser(
            @RequestBody @Valid JoinRequestDTO joinDTO
    );

    @Operation(summary = "관심 카테고리 선택", description = "회원이 관심 있는 카테고리를 선택합니다.")
    @ApiResponse(responseCode = "200", description = "관심 카테고리 선택 성공")
    @PostMapping("/{userId}/interest-categories")
    ResponseEntity<Void> selectInterestCategories(@PathVariable Long userId, @RequestBody SelectInterestDTO selectInterestDTO);

    @Operation(summary = "학번 중복 확인", description = "입력한 학번이 이미 등록되어 있는지 확인합니다.")
    @ApiResponse(responseCode = "200", description = "학번 중복 확인에 성공하였습니다.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "학번 중복 확인 요청 데이터",
            required = true,
            content = @Content(
                    schema = @Schema(implementation = CheckStudentNumberDTO.class),
                    examples = @ExampleObject(
                            name = "학번 중복 확인 요청 예제",
                            value = "{ \"studentNumber\": \"1240587\" }"
                    )
            )
    )
    @PostMapping("/check-studentNumber")
    ResponseEntity<Boolean> checkStudentNumberDuplicate(
            @RequestBody CheckStudentNumberDTO checkStudentNumberDTO
    );

    @Operation(summary = "이메일 중복 확인", description = "입력한 이메일이 이미 등록되어 있는지 확인합니다.")
    @ApiResponse(responseCode = "200", description = "이메일 중복 확인에 성공하였습니다.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "이메일 중복 확인 요청 데이터",
            required = true,
            content = @Content(
                    schema = @Schema(implementation = CheckEmailDTO.class),
                    examples = @ExampleObject(
                            name = "이메일 중복 확인 요청 예제",
                            value = "{ \"email\": \"spancer1@naver.com\" }"
                    )
            )
    )
    @PostMapping("/check-email")
    ResponseEntity<Boolean> checkEmailDuplicate(
            @RequestBody CheckEmailDTO checkEmailDTO
    );

    @Operation(summary = "비밀번호 일치 확인", description = "입력한 비밀번호와 확인용 비빌번호가 일치하는지 확인합니다")
    @ApiResponse(responseCode = "200", description = "비밀번호 확인에 성공하였습니다.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "비밀번호 일치 확인 요청 데이터",
            required = true,
            content = @Content(
                    schema = @Schema(implementation = CheckPasswordDTO.class),
                    examples = @ExampleObject(
                            name = "비밀번호 확인 요청 예제",
                            value = "{ \"password\": \"rlatngus@1\", \"confirmpassword\": \"rlatngus@1\" }"
                    )
            )
    )
    @PostMapping("/check-password")
    ResponseEntity<Boolean> checkPassword(
            @RequestBody CheckPasswordDTO checkPasswordDTO
    );

    @Operation(summary = "닉네임 중복 확인", description = "입력한 닉네임이 이미 등록되어 있는지 확인합니다")
    @ApiResponse(responseCode = "200", description = "닉네임 중복 확인에 성공하였습니다.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "닉네임 중복 확인 요청 데이터",
            required = true,
            content = @Content(
                    schema = @Schema(implementation = CheckNickNameDTO.class),
                    examples = @ExampleObject(
                            name = "닉네임 중복 확인 요청 예제",
                            value = "{ \"nickname\": \"KSH00610\" }"
                    )
            )
    )
    @PostMapping("/check-nickname")
    ResponseEntity<Boolean> checkNicknameDuplicate(
            @RequestBody CheckNickNameDTO checkNickNameDTO
    );
}
