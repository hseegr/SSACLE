package ssafy.com.ssacle.video.service;

import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.service.UserService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VideoService {
    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;
    private final SprintRepository sprintRepository;
    private final TeamRepository teamRepository;
    private final UserService userService;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    public String createSession(Long sprintId, Long teamId) throws OpenViduJavaClientException, OpenViduHttpException {
        // 스프린트 및 팀 확인
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new IllegalArgumentException("스프린트가 존재하지 않습니다."));
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("팀이 존재하지 않습니다."));
        LocalDate today = LocalDate.now();
        LocalDate announceDate = sprint.getAnnounceAt().toLocalDate();

        if (ChronoUnit.DAYS.between(today, announceDate) != 0) {
            throw new IllegalStateException("발표 시간이 되지 않았습니다.");
        }


        // 세션 생성
        Map<String, Object> params = new HashMap<>();
        params.put("customSessionId", "sprint_" + sprintId + "_team_" + teamId);
        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);

        return session.getSessionId();
    }

    public String createToken(Long sprintId, Long teamId) throws OpenViduJavaClientException, OpenViduHttpException {
        //User user = userService.getAuthenticatedUserWithTeams();

        // 해당 사용자가 팀에 속해 있는지 검증
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new IllegalArgumentException("해당 스프린트에 참여한 팀이 아닙니다."));

        String sessionId = "sprint_" + sprintId + "_team_" + teamId;
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) {
            throw new IllegalStateException("세션이 존재하지 않습니다.");
        }

        // 토큰 생성
        ConnectionProperties properties = new ConnectionProperties.Builder().build();
        Connection connection = session.createConnection(properties);

        return connection.getToken();
    }
}
