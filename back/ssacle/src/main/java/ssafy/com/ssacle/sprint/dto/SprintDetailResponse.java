package ssafy.com.ssacle.sprint.dto;

import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.category.dto.CategoryResponse;
import ssafy.com.ssacle.todo.dto.DefaultTodoResponse;

import java.util.List;

@Getter
public class SprintDetailResponse {
    private final SingleSprintResponse sprint;
    private final List<DefaultTodoResponse> todos;
    private final List<CategoryResponse> categories;

    @Builder
    public SprintDetailResponse(SingleSprintResponse sprint, List<DefaultTodoResponse> todos, List<CategoryResponse> categories){
        this.sprint=sprint;
        this.todos=todos;
        this.categories=categories;
    }
}
