package ssafy.com.ssacle.sprint.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import ssafy.com.ssacle.todo.dto.TodoRequest;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class SprintCreateRequest {
    @NotNull
    private String name;

    @NotNull
    private String basicDescription;

    @NotNull
    private String detailDescription;

    @NotNull
    private String recommendedFor;

    @NotNull
    private LocalDateTime startAt;

    @NotNull
    private LocalDateTime endAt;

    @NotNull
    private LocalDateTime announceAt;

    @NotNull
    private Integer maxMembers;

    @NotNull
    private List<TodoRequest> todos;

    @NotNull
    private List<Long> categoryIds;
}
