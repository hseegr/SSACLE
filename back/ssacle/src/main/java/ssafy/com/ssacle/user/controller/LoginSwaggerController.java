package ssafy.com.ssacle.user.controller;

import io.swagger.v3.oas.annotations.Operation;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import ssafy.com.ssacle.user.domain.Role;
import ssafy.com.ssacle.user.dto.FindEmailDTO;
import ssafy.com.ssacle.user.dto.FindPasswordDTO;
import ssafy.com.ssacle.user.dto.LoginRequestDTO;

@Tag(name = "Login & Logout API", description = "로그인 & 로그아웃 API입니다.")
public interface LoginSwaggerController {

    @Operation(summary="로그인", description= "사용자가 로그인 시 사용되는 api입니다.")
    @ApiResponse(responseCode = "201", description = "로그인에 성공하였습니다.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "로그인 요청 데이터",
            required = true,
            content = @Content(
                    schema = @Schema(implementation = LoginRequestDTO.class),
                    examples = @ExampleObject(
                            name = "로그인 예제",
                            value = "{ \"email\": \"admin@example.com\", \"password\": \"admin1234\" }"
                    )
            )
    )
    @PostMapping("/login")
    ResponseEntity<Role> login(
            @RequestBody @Valid LoginRequestDTO loginDTO, HttpServletRequest request, HttpServletResponse response
    );

    @Operation(summary = "로그아웃", description = "현재 로그인된 사용자를 로그아웃합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그아웃에 성공했습니다."),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자입니다.", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 에러 발생", content = @Content)
    })
    @PostMapping("/logout")
    ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response);

    @Operation(summary = "이메일 찾기", description = "사용자가 학번을 입력하면 해당 학번에 등록된 이메일을 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "이메일 조회 성공"),
            @ApiResponse(responseCode = "404", description = "해당 학번으로 등록된 이메일을 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 에러 발생", content = @Content)
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "이메일 찾기 요청 데이터",
            required = true,
            content = @Content(
                    schema = @Schema(implementation = FindEmailDTO.class),
                    examples = @ExampleObject(
                            name = "이메일 찾기 예제",
                            value = "{ \"studentNumber\": \"1240587\" }"
                    )
            )
    )
    @PostMapping("/login/find-email")
    ResponseEntity<String> findEmail(
            @RequestBody FindEmailDTO findEmailDTO
    );


    @Operation(summary = "비밀번호 찾기", description = "사용자가 이메일과 학번을 입력하면 해당 계정의 비밀번호를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "비밀번호 조회 성공"),
            @ApiResponse(responseCode = "400", description = "이메일 또는 학번이 잘못됨", content = @Content),
            @ApiResponse(responseCode = "404", description = "등록된 계정을 찾을 수 없음", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 에러 발생", content = @Content)
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "비밀번호 찾기 요청 데이터",
            required = true,
            content = @Content(
                    schema = @Schema(implementation = FindPasswordDTO.class),
                    examples = @ExampleObject(
                            name = "비밀번호 찾기 예제",
                            value = "{ \"studentNumber\": \"1240587\", \"email\": \"spancer1@naver.com\" }"
                    )
            )
    )
    @PostMapping("/login/find-password")
    ResponseEntity<String> findPassword(
            @RequestBody FindPasswordDTO findPasswordDTO
    );

}
