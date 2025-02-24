package ssafy.com.ssacle.diary.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.diary.dto.DiaryDetailResponse;
import ssafy.com.ssacle.diary.dto.DiaryGroupedByDateResponse;
import ssafy.com.ssacle.diary.service.DiaryService;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.team.domain.Team;

import java.util.List;

@RestController
@RequestMapping("/api/v1/diary")
@RequiredArgsConstructor
public class DiaryController implements DiarySwaggerController{

    private final SprintRepository sprintRepository;
    private final DiaryService diaryService;

    @Override
    public ResponseEntity<List<DiaryGroupedByDateResponse>> getDiariesBySprint(Long sprintId) {
        return ResponseEntity.ok(diaryService.getDiariesBySprint(sprintId));
    }

    @Override
    public ResponseEntity<String> generateDailyDiariesNow() {
        List<Team> teams = sprintRepository.findTeamsByStatus(1);

        for (Team team : teams) {
            diaryService.generateAndSaveDiary(team);
        }
        return ResponseEntity.ok("즉시 다이어리 생성 완료!");
    }

    @Override
    public ResponseEntity<DiaryDetailResponse> getDiaryById(Long diaryId) {
        DiaryDetailResponse diaryDetail = diaryService.getDiaryById(diaryId);
        return ResponseEntity.ok(diaryDetail);
    }
}
