package ssafy.com.ssacle.diary.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.com.ssacle.diary.domain.Diary;
import ssafy.com.ssacle.diary.dto.DiaryDetailResponse;
import ssafy.com.ssacle.diary.dto.DiaryGroupedByDateResponse;
import ssafy.com.ssacle.diary.dto.DiaryResponseDTO;
import ssafy.com.ssacle.diary.exception.DiaryNotExistException;
import ssafy.com.ssacle.diary.repository.DiaryRepository;
import ssafy.com.ssacle.gpt.service.GptDiaryService;
import ssafy.com.ssacle.notion.service.NotionService;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.sprint.exception.SprintNotExistException;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.team.domain.Team;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiaryService {
    private final NotionService notionService;
    private final GptDiaryService gptDiaryService;
    private final DiaryRepository diaryRepository;
    private final SprintRepository sprintRepository;

    /** 오늘 날짜에 해당하는 노션 데이터를 가져와 GPT API로 일기 생성 후 DB 저장 */
    @Transactional
    public void generateAndSaveDiary(Team team) {
        LocalDate todayDate = LocalDate.now().minusDays(1);

        String notionContent = notionService.getTodayDiaryContent(team.getNotionURL());

        if (notionContent == null || notionContent.isEmpty()) {
            Diary diary = new Diary(team, team.getName(), "오늘 하루 쉬었으니 내일 더 열심히 해야 되겠다!", todayDate);
            diaryRepository.save(diary);

            return;
        }

        String diaryContent = gptDiaryService.generateDiary(notionContent);

        Diary diary = new Diary(team, team.getName(), diaryContent, todayDate);
        diaryRepository.save(diary);

    }

    /** 특정 스프린트 ID에 해당하는 모든 팀의 다이어리를 날짜순으로 조회 */
    @Transactional(readOnly = true)
    public List<DiaryGroupedByDateResponse> getDiariesBySprint(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(SprintNotExistException::new);

        List<Team> teams = sprint.getTeams();
        List<Diary> diaries = diaryRepository.findByTeamInOrderByDateAsc(teams);

        List<DiaryResponseDTO> diaryResponses = diaries.stream()
                .map(diary -> new DiaryResponseDTO(diary.getId(), diary.getTitle(), diary.getDate()))
                .collect(Collectors.toList());

        return DiaryGroupedByDateResponse.fromList(diaryResponses);
    }

    public DiaryDetailResponse getDiaryById(Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(DiaryNotExistException::new);
        return DiaryDetailResponse.from(diary);
    }

    public void saveDiary(Diary diary) {
        diaryRepository.save(diary);
    }

}
