package ssafy.com.ssacle.presentation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.com.ssacle.diary.repository.DiaryRepository;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.dto.TeamWithMembersDTO;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.todo.repository.TodoRepository;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.dto.UserResponseDTO;
import ssafy.com.ssacle.user.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PresentationService {
    private final TodoRepository todoRepository;
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    private static final double TODO_WEIGHT = 25.0;
    private static final double DIARY_WEIGHT = 25.0;
    private static final double JUDGE_WEIGHT = 50.0;
    private static final String DEFAULT_DIARY_MESSAGE = "오늘 하루 쉬었으니 내일 더 열심히 해야 되겠다!";

    @Transactional
    public void calculateFinalScore(Team team, Long sprintId, double judgeScore) {
        double totalPoint = calculateTodoCompletionRate(sprintId)
                + calculateDiaryCompletionRate(sprintId)
                + (judgeScore / 100.0) * JUDGE_WEIGHT;

        team.setPoint(team.getPoint() + (int) totalPoint);
    }

    private double calculateTodoCompletionRate(Long sprintId) {
        long totalTodos = todoRepository.countAllTodosBySprint(sprintId);
        long completedTodos = todoRepository.countCompletedTodosBySprint(sprintId);

        if (totalTodos == 0) {
            return 0.0;
        }

        return ((double) completedTodos / totalTodos) * TODO_WEIGHT;
    }

    private double calculateDiaryCompletionRate(Long sprintId) {
        long totalDiaries = diaryRepository.countAllDiariesBySprint(sprintId);
        long writtenDiaries = diaryRepository.countWrittenDiariesBySprint(sprintId, DEFAULT_DIARY_MESSAGE);

        if (totalDiaries == 0) {
            return 0.0;
        }

        return ((double) writtenDiaries / totalDiaries) * DIARY_WEIGHT;
    }

    @Transactional(readOnly = true)
    public List<TeamWithMembersDTO> getPresentationParticipants(Long sprintId) {
        // Sprint sprint = sprintRepository.findById(sprintId).orElseThrow(SprintNotExistException::new);
        List<Team> teams = teamRepository.findTeamsBySprintOrSsaldCup(sprintId);
        List<Long> userIds = teams.stream()
                .flatMap(team -> team.getUserTeams().stream())
                .map(userTeam -> userTeam.getUser().getId())
                .distinct()
                .collect(Collectors.toList());
        List<User> users = userRepository.findByIdIn(userIds);
        List<TeamWithMembersDTO> list = new ArrayList<>();
        Map<Long, User> userMap = users.stream()
                .collect(Collectors.toMap(User::getId, user -> user));

        for(Team team : teams){
            List<UserResponseDTO> userDTOs = team.getUserTeams().stream()
                    .map(userTeam -> {
                        User user = userMap.get(userTeam.getUser().getId());
                        return UserResponseDTO.of(user, null); // 카테고리는 임시 값
                    })
                    .collect(Collectors.toList());

            list.add(TeamWithMembersDTO.builder()
                    .id(team.getId())
                    .name(team.getName())
                    .point(team.getPoint())
                    .users(userDTOs)
                    .build());
        }
        return list;
    }
}
