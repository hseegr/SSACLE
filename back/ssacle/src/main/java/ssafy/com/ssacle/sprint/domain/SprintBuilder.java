package ssafy.com.ssacle.sprint.domain;

import ssafy.com.ssacle.ssaldcup.domain.SsaldCup;
import ssafy.com.ssacle.todo.domain.DefaultTodo;
import ssafy.com.ssacle.todo.dto.TodoRequest;

import java.time.LocalDateTime;
import java.util.List;

public class SprintBuilder {
    private String name;
    private String basicDescription;
    private String detailDescription;
    private String recommendedFor;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private LocalDateTime announceAt;
    private Integer maxMembers;
    private List<TodoRequest> defaultTodoRequests;
    private SsaldCup ssaldCup;

    public static SprintBuilder builder() {
        return new SprintBuilder();
    }

    public SprintBuilder name(String name){
        this.name = name;
        return this;
    }
    public SprintBuilder basicDescription(String basicDescription){
        this.basicDescription = basicDescription;
        return this;
    }
    public SprintBuilder detailDescription(String detailDescription){
        this.detailDescription = detailDescription;
        return this;
    }
    public SprintBuilder recommendedFor(String recommendedFor){
        this.recommendedFor = recommendedFor;
        return this;
    }
    public SprintBuilder startAt(LocalDateTime startAt){
        this.startAt = startAt;
        return this;
    }
    public SprintBuilder endAt(LocalDateTime endAt){
        this.endAt = endAt;
        return this;
    }
    public SprintBuilder announceAt(LocalDateTime announceAt){
        this.announceAt = announceAt;
        return this;
    }
    public SprintBuilder maxMembers(Integer maxMembers){
        this.maxMembers = maxMembers;
        return this;
    }
    public SprintBuilder defaultTodos(List<TodoRequest> defaultTodoRequests) {
        this.defaultTodoRequests = defaultTodoRequests;
        return this;
    }

    public SprintBuilder ssaldCup(SsaldCup ssaldCup){
        this.ssaldCup=ssaldCup;
        return this;
    }

    private Integer calculateStatus(){
        LocalDateTime now = LocalDateTime.now();

        if (now.isBefore(startAt)) {
            return 0;
        } else if (!now.isAfter(endAt)) {
            return 1;
        } else {
            return 2;
        }
    }

    public Sprint build(){
        Sprint sprint = new Sprint(name, basicDescription, detailDescription, recommendedFor, startAt, endAt, announceAt, calculateStatus(), 1, maxMembers, 1, LocalDateTime.now());

        if(ssaldCup !=null)
            sprint.setSsaldCup(ssaldCup);
        if (defaultTodoRequests != null && !defaultTodoRequests.isEmpty()) {
            List<DefaultTodo> defaultTodos = defaultTodoRequests.stream()
                    .flatMap(todoRequest -> todoRequest.toEntity(sprint).stream())
                    .toList();
            defaultTodos.forEach(sprint::addDefaultTodo);
        }

        return sprint;
    }
}

