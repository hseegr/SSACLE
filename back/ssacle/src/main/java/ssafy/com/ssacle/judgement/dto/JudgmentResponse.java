package ssafy.com.ssacle.judgement.dto;

import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.judgement.domain.Judgment;

import java.time.LocalDateTime;

@Getter
public class JudgmentResponse {
    private final Long id;
    private final String userName;
    private final String studentNumber;
    private final String nickname;
    private final Long sprintId;
    private final LocalDateTime createdAt;

    @Builder
    public JudgmentResponse(Judgment judgment) {
        this.id = judgment.getId();
        this.userName = judgment.getUser().getName();
        this.studentNumber = judgment.getUser().getStudentNumber();
        this.nickname = judgment.getUser().getNickname();
        this.sprintId = judgment.getSprint().getId();
        this.createdAt = judgment.getCreatedAt();
    }

    public static JudgmentResponse from(Judgment judgment) {
        return JudgmentResponse.builder().judgment(judgment).build();
    }
}
