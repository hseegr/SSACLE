package ssafy.com.ssacle.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.sprint.dto.SprintSummaryResponse;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.dto.UserResponseDTO;
import ssafy.com.ssacle.user.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController implements UserSwaggerController{

    private final UserService userService;


    @Override
    public ResponseEntity<UserResponseDTO> getUserInfo() {
        User user = userService.getAuthenticatedUser();
        return ResponseEntity.ok().body(userService.getCurrentUser(user));
    }

    @Override
    public ResponseEntity<List<SprintSummaryResponse>> getUserParticipateSprint() {
        User user = userService.getAuthenticatedUser();
        return ResponseEntity.ok().body(userService.getParicipateSprint(user));
    }
}
