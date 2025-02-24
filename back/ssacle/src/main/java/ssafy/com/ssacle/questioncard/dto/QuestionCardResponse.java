package ssafy.com.ssacle.questioncard.dto;

import lombok.Builder;
import lombok.Getter;
import ssafy.com.ssacle.questioncard.domain.QuestionCard;

import java.time.LocalDateTime;

@Getter
public class QuestionCardResponse {
    private final Long id;
    private final String description;
    private final boolean isOpened;
    private final LocalDateTime createdAt;
    private final Long teamId;

    @Builder
    public QuestionCardResponse(QuestionCard questionCard) {
        this.id = questionCard.getId();
        this.description = questionCard.getDescription();
        this.isOpened = questionCard.isOpened();
        this.createdAt = questionCard.getCreatedAt();
        this.teamId = questionCard.getTeam().getId();
    }

    public static QuestionCardResponse from(QuestionCard questionCard) {
        return QuestionCardResponse.builder().questionCard(questionCard).build();
    }
}
