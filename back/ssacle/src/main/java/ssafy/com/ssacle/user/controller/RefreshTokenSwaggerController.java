package ssafy.com.ssacle.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

@Tag(name = "RefreshToken API", description = "토큰 API입니다.")
public interface RefreshTokenSwaggerController {
    @Operation(
            summary = "Access Token 재발급",
            description = "Refresh Token을 이용하여 새로운 Access Token을 발급합니다. " +
                    "Refresh Token이 유효하면 새로운 Access Token을 반환하고, " +
                    "유효하지 않으면 401 응답을 반환합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "새로운 Access Token이 발급되었습니다."),
            @ApiResponse(responseCode = "401", description = "Refresh Token이 만료되었거나 유효하지 않습니다.", content = @Content),
            @ApiResponse(responseCode = "400", description = "Refresh Token이 요청에 포함되지 않았습니다.", content = @Content)
    })
    @PostMapping
    ResponseEntity<String> refreshAccessToken(HttpServletRequest request, HttpServletResponse response);
}
