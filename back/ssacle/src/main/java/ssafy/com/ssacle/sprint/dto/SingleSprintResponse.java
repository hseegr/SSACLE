package ssafy.com.ssacle.sprint.dto;

import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.sprint.domain.Sprint;

import java.time.LocalDateTime;

@Getter
public class SingleSprintResponse {
    private Long id;
    private String name;
    private String description;
    private String detail;
    private String tags;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private LocalDateTime announceAt;
    private Integer status;
    private Integer sequence;
    private Integer maxMembers;
    private Integer currentMembers;
    private LocalDateTime createdAt;

    @Builder
    public SingleSprintResponse(Sprint sprint) {
        this.id = sprint.getId();
        this.name = sprint.getName();
        this.description = sprint.getDescription();
        this.detail = sprint.getDetail();
        this.tags = sprint.getTags();
        this.startAt = sprint.getStartAt();
        this.endAt = sprint.getEndAt();
        this.announceAt = sprint.getAnnounceAt();
        this.status = sprint.getStatus();
        this.sequence = sprint.getSequence();
        this.maxMembers = sprint.getMaxMembers();
        this.currentMembers = sprint.getCurrentMembers();
        this.createdAt = sprint.getCreatedAt();
    }

    public static SingleSprintResponse from(Sprint sprint) {
        return SingleSprintResponse.builder()
                .sprint(sprint)
                .build();
    }
}
