package ssafy.com.ssacle.sprint.dto;

import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.category.dto.CategoryResponse;
import ssafy.com.ssacle.diary.dto.DiaryGroupedByDateResponse;
import ssafy.com.ssacle.questioncard.dto.QuestionCardResponse;
import ssafy.com.ssacle.team.dto.TeamResponse;
import ssafy.com.ssacle.todo.dto.TodoResponseDTO;

import java.util.List;

@Getter
public class ActiveSprintResponse {
    private final SingleSprintResponse sprint;
    private final List<CategoryResponse> categories;
    private final List<QuestionCardResponse> questionCards;
    private final TeamResponse team;
    private final List<TodoResponseDTO> todos;
    private final List<DiaryGroupedByDateResponse> diaries;

    @Builder
    public ActiveSprintResponse(SingleSprintResponse sprint, List<CategoryResponse> categories,
                                List<QuestionCardResponse> questionCards, TeamResponse team,
                                List<TodoResponseDTO> todos, List<DiaryGroupedByDateResponse> diaries) {
        this.sprint = sprint;
        this.categories = categories;
        this.questionCards = questionCards;
        this.team = team;
        this.todos = todos;
        this.diaries = diaries;
    }
}
