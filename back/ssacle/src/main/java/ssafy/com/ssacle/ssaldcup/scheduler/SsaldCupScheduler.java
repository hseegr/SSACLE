package ssafy.com.ssacle.ssaldcup.scheduler;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ssafy.com.ssacle.ssaldcup.domain.SsaldCup;
import ssafy.com.ssacle.ssaldcup.repository.SsaldCupRepository;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SsaldCupScheduler {

    private final SsaldCupRepository ssaldCupRepository;

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void updateSsaldCupStatus(){
        LocalDate today = LocalDate.now();
        List<SsaldCup> ssaldCupList = ssaldCupRepository.findAll();
        for(SsaldCup ssaldCup : ssaldCupList){
            LocalDate startDate = ssaldCup.getStartAt().toLocalDate();
            LocalDate endDate = ssaldCup.getEndAt().toLocalDate();
            if(today.equals(startDate)){
                ssaldCup.setStatus(1);
            }else if(today.equals(startDate)){
                ssaldCup.setStatus(2);
            }
        }
        ssaldCupRepository.saveAll(ssaldCupList);
    }
}
