package ssafy.com.ssacle.match.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.com.ssacle.match.domain.Game;
import ssafy.com.ssacle.match.repository.GameRepository;
import ssafy.com.ssacle.ssaldcup.domain.SsaldCup;
import ssafy.com.ssacle.ssaldcup.repository.SsaldCupRepository;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.repository.TeamRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GameService {
    private final GameRepository gameRepository;
    private final SsaldCupRepository ssaldCupRepository;
    private final TeamRepository teamRepository;

    @Transactional(readOnly = true)
    public List<Game> getLeagueSchedule(Long ssaldCupId, int week) {
        return gameRepository.findBySsaldCupIdAndWeek(ssaldCupId, week);
    }

    // 특정 싸드컵의 전체 리그 일정 조회
    @Transactional(readOnly = true)
    public List<Game> getAllLeagueSchedules(Long ssaldCupId) {
        return gameRepository.findBySsaldCupId(ssaldCupId);
    }

    // 리그 일정 생성 (DB 저장 방식)
    @Transactional
    public void createLeague(Long ssaldCupId) {
        SsaldCup ssaldCup = ssaldCupRepository.findById(ssaldCupId)
                .orElseThrow(() -> new IllegalArgumentException("해당 싸드컵이 존재하지 않습니다."));

        List<Team> teams = teamRepository.findBySsaldCupId(ssaldCupId);
        if (teams.size() < 2) {
            throw new IllegalStateException("리그를 생성하려면 최소 2개 이상의 팀이 필요합니다.");
        }

        int n = teams.size();
        boolean hasDummy = false;

        // 홀수 팀이면 더미 팀 추가
        if (n % 2 != 0) {
            Team dummy = new Team("Dummy", 0);
            teams.add(dummy);
            n++;
            hasDummy = true;
        }

        int rounds = n - 1; // 총 라운드 수
        int matchesPerRound = n / 2;

        // DB에 저장할 리그 일정 생성
        for (int round = 0; round < rounds; round++) {
            for (int match = 0; match < matchesPerRound; match++) {
                int home = (round + match) % (n - 1);
                int away = (n - 1 - match + round) % (n - 1);
                if (match == 0) {
                    away = n - 1;
                }

                // ✅ 더미 팀 제외
                if (!(hasDummy && (teams.get(home).getName().equals("Dummy") || teams.get(away).getName().equals("Dummy")))) {
                    // ✅ 매치 엔티티 생성 후 저장
                    Game matchEntity = Game.builder()
                            .ssaldCup(ssaldCup)
                            .week(round + 1)
                            .matchDate(ssaldCup.getStartAt().plusDays((round + 1) * 7)) // 주차별 날짜 설정
                            .teamMatchKey(Game.generateMatchKey(teams.get(home).getId(), teams.get(away).getId()))
                            .build();

                    gameRepository.save(matchEntity);
                }
            }
        }
    }
}
