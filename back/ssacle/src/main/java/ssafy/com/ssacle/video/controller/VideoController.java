package ssafy.com.ssacle.video.controller;

import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.user.service.UserService;
import ssafy.com.ssacle.video.service.VideoService;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/video")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    @PostMapping("/sessions")
    public ResponseEntity<String> createSession(@RequestParam Long sprintId, @RequestParam Long teamId)
            throws OpenViduJavaClientException, OpenViduHttpException {
        String sessionId = videoService.createSession(sprintId, teamId);
        return ResponseEntity.ok().body(sessionId);
    }

    /** 토큰 생성 */
    @PostMapping("/sessions/{sprintId}/{teamId}/token")
    public ResponseEntity<String> createToken(@PathVariable Long sprintId, @PathVariable Long teamId)
            throws OpenViduJavaClientException, OpenViduHttpException {
        String token = videoService.createToken(sprintId, teamId);
        return ResponseEntity.ok().body(token);
    }

}
