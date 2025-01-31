package ssafy.com.ssacle.team.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.global.jwt.JwtTokenUtil;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.dto.TeamRequestDto;
import ssafy.com.ssacle.team.dto.TeamResponseDto;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.user_team.domain.UserTeam;
import ssafy.com.ssacle.user_team.repository.UserTeamRepository;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final UserTeamRepository userTeamRepository;
    private final JwtTokenUtil jwtTokenUtil;


    @Transactional
    public TeamResponseDto createTeam(String token, TeamRequestDto requestDto) {
        // 1. JWT에서 이메일 추출
        String email = jwtTokenUtil.getUserEmailFromToken(token);

        // 2. 이메일을 통해 사용자 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 3. 팀 객체 생성 및 저장
        Team team = Team.builder()
                .name(requestDto.getName())
                .count(requestDto.getCount())  // 요청된 memberCount 값 사용
                .build();

        team = teamRepository.save(team);

        // 4. UserTeam 엔티티 생성 (사용자와 팀 연결)
        UserTeam userTeam = UserTeam.builder()
                .user(user)
                .team(team)
                .build();
        userTeamRepository.save(userTeam);

        // 5. Response DTO 생성 후 반환
        return new TeamResponseDto(team.getId(), team.getName(), team.getCount());
    }
}
