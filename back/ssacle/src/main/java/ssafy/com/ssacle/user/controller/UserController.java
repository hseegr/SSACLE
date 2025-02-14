package ssafy.com.ssacle.user.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ssafy.com.ssacle.sprint.dto.SprintRecommendResponseDTO;
import ssafy.com.ssacle.sprint.dto.SprintSummaryResponse;
import ssafy.com.ssacle.sprint.service.SprintService;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.dto.*;
import ssafy.com.ssacle.user.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController implements UserSwaggerController{

    private final UserService userService;
    private final SprintService sprintService;


    @Override
    public ResponseEntity<UserResponseDTO> getUserInfo() {
        User user = userService.getAuthenticatedUser();
        return ResponseEntity.ok().body(userService.getCurrentUser(user));
    }

    @Override
    public ResponseEntity<List<SprintRecommendResponseDTO>> getRecommendSprint() {
        User user = userService.getAuthenticatedUser();
        return ResponseEntity.ok().body(sprintService.getRecommendSprint(user));
    }

    @Override
    public ResponseEntity<List<SprintSummaryResponse>> getUserParticipateSprint() {
        User user = userService.getAuthenticatedUser();
        return ResponseEntity.ok().body(sprintService.getParicipateSprint(user));
    }

    @Override
    public ResponseEntity<UpdatePasswordResponseDTO> updatePassword(UpdatePasswordRequestDTO updatePasswordRequestDTO) {
        User user = userService.getAuthenticatedUser();
        UpdatePasswordResponseDTO updatePasswordResponseDTO = userService.updatePassword(user, updatePasswordRequestDTO);
        return ResponseEntity.ok().build();
    }



    @Override
    public ResponseEntity<ProfileUpdateResponseDTO> updateProfile(ProfileUpdateRequestDTO profileUpdateRequestDTO, MultipartFile image) {
        User user = userService.getAuthenticatedUser();
        ProfileUpdateResponseDTO profileUpdateResponseDTO = userService.updateProfile(user, profileUpdateRequestDTO, image);
        return null;
    }
}
