package ssafy.com.ssacle.lunch.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.lunch.dto.LunchResponseDTO;
import ssafy.com.ssacle.lunch.service.LunchService;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lunch")
@RequiredArgsConstructor
@Slf4j
public class LunchController implements LunchSwaggerController{
    private final LunchService lunchService;
    private final UserService userService;

    @Override
    public ResponseEntity<List<LunchResponseDTO>> getBoardById() {
        User user = userService.getAuthenticatedUser();
        List<LunchResponseDTO> responses = lunchService.getLunch(user);
        return ResponseEntity.ok().body(responses);
    }
}
