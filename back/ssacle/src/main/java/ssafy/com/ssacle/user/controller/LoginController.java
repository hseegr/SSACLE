package ssafy.com.ssacle.user.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.user.domain.Role;
import ssafy.com.ssacle.user.dto.FindEmailDTO;
import ssafy.com.ssacle.user.dto.FindPasswordDTO;
import ssafy.com.ssacle.user.dto.LoginRequestDTO;
import ssafy.com.ssacle.user.service.UserService;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class LoginController implements LoginSwaggerController{
    private final UserService userService;

    @Override
    public ResponseEntity<Role> login(@RequestBody @Valid LoginRequestDTO loginDTO, HttpServletRequest request, HttpServletResponse response) {
        Role result = userService.authenticateAndGenerateTokens(loginDTO, request, response);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        userService.logoutUser(request, response);
        return ResponseEntity.ok("Logged out successfully");
    }

    @Override
    public ResponseEntity<String> findEmail(FindEmailDTO findEmailDTO) {
        String email = userService.findEmailByStudentNumber(findEmailDTO);
        return ResponseEntity.ok(email);
    }

    @Override
    public ResponseEntity<String> findPassword(FindPasswordDTO findPasswordDTO) {
        String password = userService.findPasswordByEmailAndStudentNumber(findPasswordDTO);
        return ResponseEntity.ok(password);
    }
}
