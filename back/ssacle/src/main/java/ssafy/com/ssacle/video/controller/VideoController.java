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
@Slf4j
public class VideoController {

    private final VideoService videoService;

    @PostMapping("/distribute/manual")
    public ResponseEntity<String> distributeSessionAndTokens() throws OpenViduJavaClientException, OpenViduHttpException {
        videoService.distributeSessionAndTokensForUsers();
        log.info("✅ [수동 실행] 모든 팀원에게 세션 ID 및 토큰 발급 완료");
        return ResponseEntity.ok().body("세션 및 토큰 발급 완료 (로그 확인)");
    }

    @PostMapping("/sessions/reset-all")
    public ResponseEntity<String> resetAllSessions() {
        videoService.deleteAllSessionsAndTokens();
        return ResponseEntity.ok("모든 OpenVidu 세션이 초기화되었습니다.");
    }
//    @PostMapping("/sessions")
//    public ResponseEntity<String> createSession(@RequestParam Long sprintId, @RequestParam Long teamId)
//            throws OpenViduJavaClientException, OpenViduHttpException {
//        String sessionId = videoService.createSession(sprintId, teamId);
//        log.info("✅ [API 호출] 세션 생성 완료 | Sprint ID: {}, Team ID: {}, Session ID: {}", sprintId, teamId, sessionId);
//        return ResponseEntity.ok().body(sessionId);
//    }
//
//    /** 🔹 수동 토큰 생성 (테스트용) */
//    @PostMapping("/sessions/{sessionId}/token")
//    public ResponseEntity<String> createToken(@PathVariable String sessionId)
//            throws OpenViduJavaClientException, OpenViduHttpException {
//        String token = videoService.createToken(sessionId);
//        log.info("🎟 [API 호출] 토큰 생성 완료 | Session ID: {}, Token: {}", sessionId, token);
//        return ResponseEntity.ok().body(token);
//    }
//    @PostMapping("/sessions")
//    public ResponseEntity<String> createSession(@RequestParam Long sprintId, @RequestParam Long teamId)
//            throws OpenViduJavaClientException, OpenViduHttpException {
//        String sessionId = videoService.createSession(sprintId, teamId);
//        return ResponseEntity.ok().body(sessionId);
//    }
//
//    /** 토큰 생성 */
//    @PostMapping("/sessions/{sprintId}/{teamId}/token")
//    public ResponseEntity<String> createToken(@PathVariable Long sprintId, @PathVariable Long teamId)
//            throws OpenViduJavaClientException, OpenViduHttpException {
//        String token = videoService.createToken(sprintId, teamId);
//        return ResponseEntity.ok().body(token);
//    }

}
