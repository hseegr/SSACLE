package ssafy.com.ssacle.ssaldcup.dto;

import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.ssaldcup.domain.SsaldCup;

import java.time.LocalDateTime;

@Getter
public class SingleSsaldCupResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Integer maxTeams;
    private Integer currentTeams;
    private Integer maxTeamMembers;
    private Boolean isProcess;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private LocalDateTime createdAt;

    @Builder
    public SingleSsaldCupResponseDTO(SsaldCup ssaldCup){
        this.id=ssaldCup.getId();
        this.name = ssaldCup.getName();
        this.description=ssaldCup.getName();
        this.maxTeams= ssaldCup.getMaxTeams();
        this.currentTeams=ssaldCup.getCurrentTeams();
        this.maxTeamMembers= ssaldCup.getMaxTeamMembers();;
        this.isProcess=ssaldCup.getIsProcess();
        this.startAt=ssaldCup.getStartAt();
        this.endAt=ssaldCup.getEndAt();
        this.createdAt=ssaldCup.getCreatedAt();
    }

    public static SingleSsaldCupResponseDTO from(SsaldCup ssaldCup){
        return SingleSsaldCupResponseDTO.builder()
                .ssaldCup(ssaldCup)
                .build();
    }
}
