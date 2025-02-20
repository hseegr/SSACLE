package ssafy.com.ssacle.video.service;

import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.presentation.exception.PresentationInvalidStepException;
import ssafy.com.ssacle.sprint.exception.SprintNotExistException;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.service.UserService;
import ssafy.com.ssacle.userteam.domain.UserTeam;
import ssafy.com.ssacle.userteam.repository.UserTeamRepository;
import ssafy.com.ssacle.video.exception.VideoErrorCode;
import ssafy.com.ssacle.video.exception.VideoException;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class VideoService {
    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;
    private final SprintRepository sprintRepository;
    private final TeamRepository teamRepository;
    private final UserService userService;
    private final StringRedisTemplate redisTemplate;
    private final UserTeamRepository userTeamRepository;
    private static final long LOCK_EXPIRE_TIME = 10;


    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void distributeSessionForSprints() throws OpenViduJavaClientException, OpenViduHttpException {
        List<Sprint> sprints = sprintRepository.findSprintsByPresentationDate();
        log.info("총 {}개의 Sprint 조회됨", sprints.size());

        for (Sprint sprint : sprints) {
            log.info("Sprint: {} (ID: {})", sprint.getName(), sprint.getId());

            // ✅ 스프린트 ID만을 이용하여 세션 생성
            String sessionKey = "session:" + sprint.getId();
            String sessionId = redisTemplate.opsForValue().get(sessionKey);

            if (sessionId == null) {
                sessionId = createSession(sprint.getId());
                redisTemplate.opsForValue().set(sessionKey, sessionId, Duration.ofHours(12));
                log.info("새 세션 생성 | Sprint: {}, Session ID: {}", sprint.getName(), sessionId);
            } else {
                log.info("기존 세션 유지 | Sprint: {}, Session ID: {}", sprint.getName(), sessionId);
            }
        }
    }

    /** ✅ 스프린트 기반으로 OpenVidu 세션 생성 */
    @Transactional
    public String createSession(Long sprintId) throws OpenViduJavaClientException, OpenViduHttpException {
        SessionProperties properties = new SessionProperties.Builder()
                .customSessionId("sprint_" + sprintId)
                .build();
        Session session;

        try {
            session = openvidu.createSession(properties);
        } catch (Exception e) {
            log.error("OpenVidu 세션 생성 실패 | Sprint ID: {}, Error: {}", sprintId, e.getMessage());
            throw new VideoException(VideoErrorCode.SESSION_CREATION_FAILED);
        }

        if (session == null || session.getSessionId() == null) {
            log.error("OpenVidu 세션 생성 실패 | Sprint ID: {}", sprintId);
            throw new VideoException(VideoErrorCode.SESSION_CREATION_FAILED);
        }

        String sessionId = session.getSessionId();
        log.info("세션 생성 완료 | Sprint ID: {}, Session ID: {}", sprintId, sessionId);
        return sessionId;
    }


    /**
     * ✅ 사용자별 OpenVidu 토큰 생성 및 저장
     */
    @Transactional
    public String generateTokenForUser(Long sprintId, Long teamId, User user) throws OpenViduJavaClientException, OpenViduHttpException {
        Sprint sprint = sprintRepository.findById(sprintId).orElseThrow(SprintNotExistException::new);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime presentationStartTime = sprint.getAnnounceAt().minusMinutes(30);
        LocalDateTime presentationEndTime = sprint.getAnnounceAt();
//        if(!(now.isAfter(presentationStartTime) && now.isBefore(presentationEndTime))){
//            throw new PresentationInvalidStepException();
//        }
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        if (teamOpt.isEmpty() || !teamOpt.get().getUserTeams().stream().anyMatch(ut -> ut.getUser().getId().equals(user.getId()))) {
            log.warn("해당 Sprint에 참여하지 않은 사용자 | UserID: {}, SprintID: {}", user.getId(), sprintId);
            throw new VideoException(VideoErrorCode.INVALID_SPRINT_ACCESS);
        }

        String sessionKey = "session:" + sprintId;
        String sessionId = redisTemplate.opsForValue().get(sessionKey);
        if (sessionId == null) {
            log.warn("세션이 존재하지 않음. 새로운 세션을 생성합니다. | Sprint: {}, Team: {}", sprintId, teamId);
            sessionId = createSession(sprintId, teamId);
            redisTemplate.opsForValue().set(sessionKey, sessionId, Duration.ofHours(12));
        }

        log.info("Session ID : {} ", sessionId);
        Session session = openvidu.getActiveSession(sessionId);

        // 🚨 session이 여전히 null이라면 다시 조회 또는 새로 생성
        if (session == null) {
            log.warn("OpenVidu 세션이 null 상태입니다. 1초 대기 후 다시 조회합니다.");
            try {
                Thread.sleep(1000);  // OpenVidu가 세션을 반영할 시간을 줌
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            session = openvidu.getActiveSession(sessionId);
        }

        // 🚨 그래도 session이 null이면 최종적으로 새로 생성
        if (session == null) {
            log.warn("OpenVidu 세션이 여전히 존재하지 않습니다. 강제 생성합니다. | Sprint: {}, Team: {}", sprintId, teamId);
            sessionId = createSession(sprintId, teamId);
            redisTemplate.opsForValue().set(sessionKey, sessionId, Duration.ofHours(12));
            session = openvidu.getActiveSession(sessionId);
        }

        if (session == null) {
            log.error("OpenVidu 세션을 최종적으로 생성하지 못했습니다. | Sprint: {}, Team: {}", sprintId, teamId);
            throw new VideoException(VideoErrorCode.SESSION_CREATION_FAILED);
        }

        String tokenKey = "token:" + sprintId + ":" + teamId + ":" + user.getNickname();
        String existingToken = redisTemplate.opsForValue().get(tokenKey);

        if (existingToken != null) {
            log.info("기존 토큰 유지 | Sprint: {}, Team: {}, User: {}, Token: {}", sprintId, teamId, user.getNickname(), existingToken);
            return existingToken;
        }

        // 🚨 session이 null이 아닌 상태에서 토큰 생성
        ConnectionProperties properties = new ConnectionProperties.Builder().build();
        Connection connection = session.createConnection(properties);
        String token = connection.getToken();

        redisTemplate.opsForValue().set(tokenKey, token, Duration.ofHours(12));
        log.info("토큰 발급 완료 | Sprint: {}, Team: {}, User: {}, Token: {}", sprintId, teamId, user.getNickname(), token);
        return token;
    }


    @Transactional
    public String createSession(Long sprintId, Long teamId) throws OpenViduJavaClientException, OpenViduHttpException {
        SessionProperties properties = new SessionProperties.Builder()
                    .customSessionId("sprint_" + sprintId + "_team_" + teamId)
                    .build();
        Session session=null;
        try {
            session = openvidu.createSession(properties);
        } catch (Exception e) {
            log.error("OpenVidu 세션 생성 실패 | Sprint ID: {}, Team ID: {}, Error: {}", sprintId, teamId, e.getMessage());
            throw new VideoException(VideoErrorCode.SESSION_CREATION_FAILED);
        }

        if (session == null || session.getSessionId() == null) {
            log.error("🚨 OpenVidu 세션 생성 실패 | Sprint ID: {}, Team ID: {}", sprintId, teamId);
            throw new VideoException(VideoErrorCode.SESSION_CREATION_FAILED);
        }

        String sessionId = session.getSessionId();

        log.info("세션 생성 완료 | Sprint ID: {}, Team ID: {}, Session ID: {}", sprintId, teamId, sessionId);
        return sessionId;

    }


    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void deleteAllSessionsAndTokens() {
        log.info("모든 세션과 토큰 삭제 시작...");

        // Redis 모든 데이터 삭제
        redisTemplate.getConnectionFactory().getConnection().flushDb();
        log.info("Redis 전체 삭제 완료.");

        // OpenVidu 활성 세션 삭제
        List<Session> activeSessions;
        do {
            activeSessions = openvidu.getActiveSessions();
            for (Session session : activeSessions) {
                try {
                    session.close();
                    log.info("OpenVidu 세션 종료 완료 | Session ID: {}", session.getSessionId());
                } catch (Exception e) {
                    log.error("OpenVidu 세션 종료 중 오류 발생 | Session ID: {}, Error: {}", session.getSessionId(), e.getMessage());
                }
            }

        } while (!activeSessions.isEmpty());
        log.info("✅ 모든 OpenVidu 세션 삭제 완료.");
    }
    /** ✅ 사용자의 Sprint 참여 팀 ID 조회 */
    @Transactional
    public Long getUserTeamId(User user, Long sprintId) {
        List<UserTeam> userTeams = userTeamRepository.findUserTeamsWithSprint(user.getId(), sprintId);

        return userTeams.stream()
                .map(userTeam -> userTeam.getTeam().getId())
                .findFirst()
                .orElse(null);
    }

    //    @Transactional
//    public String createToken(Long sprintId, Long teamId, UserTeam userTeam, Session session) throws OpenViduJavaClientException, OpenViduHttpException {
//            ConnectionProperties properties = new ConnectionProperties.Builder().build();
//            Connection connection = session.createConnection(properties);
//            String token = connection.getToken();
//            return token;
//
//    }
}
