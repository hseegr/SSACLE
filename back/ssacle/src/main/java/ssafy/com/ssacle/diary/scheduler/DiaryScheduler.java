package ssafy.com.ssacle.diary.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ssafy.com.ssacle.diary.service.DiaryService;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.team.domain.Team;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DiaryScheduler {

    private final SprintRepository sprintRepository;
    private final DiaryService diaryService;

    /** 매일 새벽 3시에 실행 (status = 1인 팀 대상) */
    @Scheduled(cron = "0 0 3 * * ?")
    public void generateDailyDiaries() {
        List<Team> teams = sprintRepository.findTeamsByStatus(1);
        for (Team team : teams) {
            diaryService.generateAndSaveDiary(team);
        }
    }
}
