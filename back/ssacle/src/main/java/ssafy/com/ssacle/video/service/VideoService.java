package ssafy.com.ssacle.video.service;

import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.service.UserService;
import ssafy.com.ssacle.userteam.domain.UserTeam;
import ssafy.com.ssacle.userteam.repository.UserTeamRepository;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

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

//    @Transactional
//    public void distributeSessionAndTokensForUsers() throws OpenViduJavaClientException, OpenViduHttpException {
//        List<Sprint> sprints = sprintRepository.findSprintsByPresentationDate();
//        log.info("📌 총 {}개의 Sprint 조회됨", sprints.size());
//
//        List<Long> sprintIds = sprints.stream().map(Sprint::getId).toList();
//        List<Team> teams = teamRepository.findTeamsWithUsersBySprintIds(sprintIds);
//        log.info("📌 총 {}개의 Team 조회됨", teams.size());
//
//        Map<Long, Team> teamMap = teams.stream().collect(Collectors.toMap(Team::getId, team -> team));
//
//        for (Sprint sprint : sprints) {
//            log.info("➡️ Sprint: {} (ID: {})", sprint.getName(), sprint.getId());
//
//            for (Team team : sprint.getTeams()) {
//                log.info("🔹 Team: {} (ID: {})", team.getName(), team.getId());
//
//                Team fullTeam = teamMap.get(team.getId());
//                if (fullTeam == null) {
//                    log.warn("⚠️ 팀 정보가 존재하지 않음! (Team ID: {})", team.getId());
//                    continue;
//                }
//
//                // 1️⃣ 세션 처리 (이미 존재하면 생성하지 않음)
//                String sessionKey = "session:" + sprint.getId() + ":" + team.getId();
//                String sessionId = redisTemplate.opsForValue().get(sessionKey);
//
//                if (sessionId == null) {
//                    sessionId = createSession(sprint.getId(), team.getId());
//                    redisTemplate.opsForValue().set(sessionKey, sessionId, Duration.ofHours(12));
//                    log.info("✅ 새 세션 생성 | Sprint: {}, Team: {}, Session ID: {}", sprint.getName(), team.getName(), sessionId);
//                } else {
//                    log.info("✅ 기존 세션 사용 | Sprint: {}, Team: {}, Session ID: {}", sprint.getName(), team.getName(), sessionId);
//                }
//
//                // 2️⃣ 세션이 있으면, 모든 사용자에게 개별 토큰 발급
//                Session session = openvidu.getActiveSession(sessionId);
//                if (session == null) {
//                    log.warn("🚨 OpenVidu 세션이 만료됨. 새로 생성합니다.");
//                    sessionId = createSession(sprint.getId(), team.getId());
//                    redisTemplate.opsForValue().set(sessionKey, sessionId, Duration.ofHours(12));
//                    session = openvidu.getActiveSession(sessionId);
//                }
//
//                for (UserTeam userTeam : fullTeam.getUserTeams()) {
//                    log.info("👤 User: {} (UserID: {})", userTeam.getUser().getNickname(), userTeam.getUser().getId());
//
//                    String tokenKey = "token:" + sprint.getId() + ":" + team.getId() + ":" + userTeam.getUser().getNickname();
//                    String existingToken = redisTemplate.opsForValue().get(tokenKey);
//
//                    if (existingToken != null) {
//                        log.info("🎟 기존 토큰 존재 | Sprint: {}, Team: {}, User: {}, Token: {}", sprint.getName(), team.getName(), userTeam.getUser().getNickname(), existingToken);
//                        continue;
//                    }
//
//                    // 3️⃣ 새로운 토큰 생성 후 Redis 저장
//                    String token = createToken(sprint.getId(), team.getId(), userTeam, session);
//                    redisTemplate.opsForValue().set(tokenKey, token, Duration.ofHours(12));
//
//                    log.info("🎟 토큰 발급 완료 | Sprint: {}, Team: {}, User: {}, Token: {}", sprint.getName(), team.getName(), userTeam.getUser().getNickname(), token);
//                }
//            }
//        }
//    }

    @Transactional
    public void distributeSessionForSprints() throws OpenViduJavaClientException, OpenViduHttpException {
        List<Sprint> sprints = sprintRepository.findSprintsByPresentationDate();
        log.info("📌 총 {}개의 Sprint 조회됨", sprints.size());

        for (Sprint sprint : sprints) {
            log.info("➡️ Sprint: {} (ID: {})", sprint.getName(), sprint.getId());

            // ✅ 스프린트 ID만을 이용하여 세션 생성
            String sessionKey = "session:" + sprint.getId();
            String sessionId = redisTemplate.opsForValue().get(sessionKey);

            if (sessionId == null) {
                sessionId = createSession(sprint.getId());
                redisTemplate.opsForValue().set(sessionKey, sessionId, Duration.ofHours(12));
                log.info("✅ 새 세션 생성 | Sprint: {}, Session ID: {}", sprint.getName(), sessionId);
            } else {
                log.info("✅ 기존 세션 유지 | Sprint: {}, Session ID: {}", sprint.getName(), sessionId);
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
            log.error("🚨 OpenVidu 세션 생성 실패 | Sprint ID: {}, Error: {}", sprintId, e.getMessage());
            throw new IllegalStateException("OpenVidu 세션 생성 중 오류 발생", e);
        }

        if (session == null || session.getSessionId() == null) {
            log.error("🚨 OpenVidu 세션 생성 실패 | Sprint ID: {}", sprintId);
            throw new IllegalStateException("OpenVidu 세션 생성 중 오류 발생");
        }

        String sessionId = session.getSessionId();
        log.info("✅ 세션 생성 완료 | Sprint ID: {}, Session ID: {}", sprintId, sessionId);
        return sessionId;
    }


    /**
     * ✅ 사용자별 OpenVidu 토큰 생성 및 저장
     */
    @Transactional
    public String generateTokenForUser(Long sprintId, Long teamId, User user) throws OpenViduJavaClientException, OpenViduHttpException {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        if (teamOpt.isEmpty() || !teamOpt.get().getUserTeams().stream().anyMatch(ut -> ut.getUser().getId().equals(user.getId()))) {
            log.warn("🚨 해당 Sprint에 참여하지 않은 사용자 | UserID: {}, SprintID: {}", user.getId(), sprintId);
            throw new IllegalStateException("해당 스프린트에 참여하지 않은 사용자입니다.");
        }

        String sessionKey = "session:" + sprintId;
        String sessionId = redisTemplate.opsForValue().get(sessionKey);
        if (sessionId == null) {
            log.warn("🚨 세션이 존재하지 않음. 새로운 세션을 생성합니다. | Sprint: {}, Team: {}", sprintId, teamId);
            sessionId = createSession(sprintId, teamId);
            redisTemplate.opsForValue().set(sessionKey, sessionId, Duration.ofHours(12));
        }

        log.info("Session ID : {} ", sessionId);
        Session session = openvidu.getActiveSession(sessionId);

        // 🚨 session이 여전히 null이라면 다시 조회 또는 새로 생성
        if (session == null) {
            log.warn("🚨 OpenVidu 세션이 null 상태입니다. 1초 대기 후 다시 조회합니다.");
            try {
                Thread.sleep(1000);  // OpenVidu가 세션을 반영할 시간을 줌
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            session = openvidu.getActiveSession(sessionId);
        }

        // 🚨 그래도 session이 null이면 최종적으로 새로 생성
        if (session == null) {
            log.warn("🚨 OpenVidu 세션이 여전히 존재하지 않습니다. 강제 생성합니다. | Sprint: {}, Team: {}", sprintId, teamId);
            sessionId = createSession(sprintId, teamId);
            redisTemplate.opsForValue().set(sessionKey, sessionId, Duration.ofHours(12));
            session = openvidu.getActiveSession(sessionId);
        }

        if (session == null) {
            log.error("🚨 OpenVidu 세션을 최종적으로 생성하지 못했습니다. | Sprint: {}, Team: {}", sprintId, teamId);
            throw new IllegalStateException("OpenVidu 세션을 생성할 수 없습니다.");
        }

        String tokenKey = "token:" + sprintId + ":" + teamId + ":" + user.getNickname();
        String existingToken = redisTemplate.opsForValue().get(tokenKey);

        if (existingToken != null) {
            log.info("🎟 기존 토큰 유지 | Sprint: {}, Team: {}, User: {}, Token: {}", sprintId, teamId, user.getNickname(), existingToken);
            return existingToken;
        }

        // 🚨 session이 null이 아닌 상태에서 토큰 생성
        ConnectionProperties properties = new ConnectionProperties.Builder().build();
        Connection connection = session.createConnection(properties);
        String token = connection.getToken();

        redisTemplate.opsForValue().set(tokenKey, token, Duration.ofHours(12));
        log.info("🎟 토큰 발급 완료 | Sprint: {}, Team: {}, User: {}, Token: {}", sprintId, teamId, user.getNickname(), token);
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
            log.error("🚨 OpenVidu 세션 생성 실패 | Sprint ID: {}, Team ID: {}, Error: {}", sprintId, teamId, e.getMessage());
            throw new IllegalStateException("OpenVidu 세션 생성 중 오류 발생", e);
        }

        if (session == null || session.getSessionId() == null) {
            log.error("🚨 OpenVidu 세션 생성 실패 | Sprint ID: {}, Team ID: {}", sprintId, teamId);
            throw new IllegalStateException("OpenVidu 세션 생성 중 오류 발생");
        }

        String sessionId = session.getSessionId();

        log.info("✅ 세션 생성 완료 | Sprint ID: {}, Team ID: {}, Session ID: {}", sprintId, teamId, sessionId);
        return sessionId;

    }

    @Transactional
    public String createToken(Long sprintId, Long teamId, UserTeam userTeam, Session session) throws OpenViduJavaClientException, OpenViduHttpException {
            ConnectionProperties properties = new ConnectionProperties.Builder().build();
            Connection connection = session.createConnection(properties);
            String token = connection.getToken();
            return token;

    }

    @Transactional
    public void deleteAllSessionsAndTokens() {
        log.info("🔴 모든 세션과 토큰 삭제 시작...");

        // Redis 모든 데이터 삭제
        redisTemplate.getConnectionFactory().getConnection().flushDb();
        log.info("✅ Redis 전체 삭제 완료.");

        // OpenVidu 활성 세션 삭제
        List<Session> activeSessions;
        do {
            activeSessions = openvidu.getActiveSessions();
            for (Session session : activeSessions) {
                try {
                    session.close();
                    log.info("✅ OpenVidu 세션 종료 완료 | Session ID: {}", session.getSessionId());
                } catch (Exception e) {
                    log.error("🚨 OpenVidu 세션 종료 중 오류 발생 | Session ID: {}, Error: {}", session.getSessionId(), e.getMessage());
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
//    public void deleteAllSessionsAndTokens() {
//        String deleteLockKey = "delete_lock";
//        ValueOperations<String, String> ops = redisTemplate.opsForValue();
//
//        try {
//            // Redis 분산 락 획득 (LOCK_EXPIRE_TIME 동안 유효)
//            Boolean lockAcquired = ops.setIfAbsent(deleteLockKey, "LOCK", Duration.ofSeconds(LOCK_EXPIRE_TIME));
//            if (lockAcquired == null || !lockAcquired) {
//                log.warn("🚨 세션 및 토큰 삭제 중복 방지: 다른 요청이 삭제 중입니다.");
//                return;
//            }
//
//            log.info("🔴 모든 세션과 토큰 삭제 시작...");
//
//            // 1️⃣ 현재 OpenVidu에서 활성 세션 조회 후 종료 시도
//            List<Session> activeSessions = openvidu.getActiveSessions();
//            if (!activeSessions.isEmpty()) {
//                for (Session session : activeSessions) {
//                    try {
//                        session.close(); // OpenVidu 세션 종료
//                        log.info("✅ OpenVidu 세션 종료 완료 | Session ID: {}", session.getSessionId());
//                    } catch (OpenViduJavaClientException | OpenViduHttpException e) {
//                        log.error("🚨 OpenVidu 세션 종료 중 오류 발생 | Session ID: {}, Error: {}", session.getSessionId(), e.getMessage());
//                    }
//                }
//            } else {
//                log.info("✅ 현재 OpenVidu에 활성 세션이 없습니다.");
//            }
//
//            // 2️⃣ Redis에서 세션 및 토큰 삭제
//            Set<String> sessionKeys = redisTemplate.keys("session:*");
//            Set<String> tokenKeys = redisTemplate.keys("token:*");
//
//            if (sessionKeys != null && !sessionKeys.isEmpty()) {
//                redisTemplate.delete(sessionKeys);
//                log.info("✅ Redis에서 모든 세션 삭제 완료.");
//            }
//
//            if (tokenKeys != null && !tokenKeys.isEmpty()) {
//                redisTemplate.delete(tokenKeys);
//                log.info("✅ Redis에서 모든 토큰 삭제 완료.");
//            }
//        } catch (Exception e) {
//            log.error("🚨 세션 및 토큰 삭제 중 오류 발생: {}", e.getMessage());
//        } finally {
//            // 락 해제
//            redisTemplate.delete(deleteLockKey);
//        }
//    }

//    public String createToken(Long sprintId, Long teamId) {
//    }


    //   /** 🕒 새벽 2시: 발표할 스프린트 팀별 세션 ID 생성 */
//    @Scheduled(cron = "0 0 2 * * *")
//    public void createSprintSessions() throws OpenViduJavaClientException, OpenViduHttpException {
//        List<Sprint> sprints = sprintRepository.findAllByPresentationDate();
//
//        for (Sprint sprint : sprints) {
//            for (Team team : sprint.getTeams()) {
//                String sessionId = createSession(sprint.getId(), team.getId());
//                redisTemplate.opsForValue().set(
//                        "session:" + sprint.getId() + ":" + team.getId(), sessionId, Duration.ofHours(12)
//                );
//                log.info("✅ 세션 생성 완료 | Sprint: {}, Team: {}, Session ID: {}", sprint.getName(), team.getName(), sessionId);
//            }
//        }
//    }
//
//    /** 🕒 새벽 3시: 팀원들에게 토큰 발급 */
//    @Scheduled(cron = "0 0 3 * * *")
//    public void generateTokensForUsers() throws OpenViduJavaClientException, OpenViduHttpException {
//        List<Sprint> sprints = sprintRepository.findAllByPresentationDate();
//
//        for (Sprint sprint : sprints) {
//            for (Team team : sprint.getTeams()) {
//                String sessionId = redisTemplate.opsForValue().get("session:" + sprint.getId() + ":" + team.getId());
//                if (sessionId == null) {
//                    log.warn("🚨 세션이 존재하지 않음 | Sprint: {}, Team: {}", sprint.getName(), team.getName());
//                    continue;
//                }
//
//                for (UserTeam userTeam : team.getUserTeams()) {
//                    String token = createToken(sessionId);
//                    log.info("🎟 토큰 발급 완료 | Sprint: {}, Team: {}, User: {}, Token: {}", sprint.getName(), team.getName(), userTeam.getUser().getNickname(), token);
//                }
//            }
//        }
//    }
//
//

}
