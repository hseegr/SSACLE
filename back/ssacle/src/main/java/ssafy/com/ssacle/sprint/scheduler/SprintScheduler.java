package ssafy.com.ssacle.sprint.scheduler;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.sprint.repository.SprintRepository;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SprintScheduler {

    private final SprintRepository sprintRepository;

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void updateSprintStatus() {
        LocalDate today = LocalDate.now();

        List<Sprint> sprints = sprintRepository.findAll();

        for (Sprint sprint : sprints) {
            LocalDate startDate = sprint.getStartAt().toLocalDate();
            LocalDate endDate = sprint.getEndAt().toLocalDate();

            if (today.equals(startDate)) {
                sprint.setStatus(1);
            } else if (today.equals(endDate)) {
                sprint.setStatus(2);
            }
        }

        sprintRepository.saveAll(sprints);
    }
}
