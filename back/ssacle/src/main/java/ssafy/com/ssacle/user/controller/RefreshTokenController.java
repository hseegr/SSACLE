package ssafy.com.ssacle.user.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.user.service.UserService;

@RestController
@RequestMapping("/api/v1/refreshtoken")
@RequiredArgsConstructor
public class RefreshTokenController implements RefreshTokenSwaggerController{
    private final UserService userService;

    @Override
    public ResponseEntity<String> refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        String result = userService.refreshAccessTokenFromRequest(request, response);
        return ResponseEntity.ok(result);
    }
}
