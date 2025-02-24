package ssafy.com.ssacle.questioncard.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.com.ssacle.presentation.domain.PresentationStatus;
import ssafy.com.ssacle.questioncard.domain.QuestionCard;
import ssafy.com.ssacle.questioncard.dto.QuestionCardRequest;
import ssafy.com.ssacle.questioncard.dto.QuestionCardResponse;
import ssafy.com.ssacle.questioncard.exception.QuestionCardNotFoundException;
import ssafy.com.ssacle.questioncard.repository.QuestionCardRepository;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.presentation.exception.InvalidPresentationStatusException;
import ssafy.com.ssacle.sprint.exception.SprintNotExistException;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.exception.TeamNotFoundException;
import ssafy.com.ssacle.team.exception.UnauthorizedTeamException;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.userteam.repository.UserTeamRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionCardService {
    private final QuestionCardRepository questionCardRepository;
    private final SprintRepository sprintRepository;
    private final TeamRepository teamRepository;
    private final UserTeamRepository userTeamRepository;

    public QuestionCardResponse createQuestionCard(QuestionCardRequest request) {
        Sprint sprint = sprintRepository.findById(request.getSprintId())
                .orElseThrow(SprintNotExistException::new);

        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(TeamNotFoundException::new);

        QuestionCard questionCard = QuestionCard.builder()
                .sprint(sprint)
                .team(team)
                .description(request.getDescription())
                .isOpened(request.isOpened())
                .build();

        return QuestionCardResponse.from(questionCardRepository.save(questionCard));
    }
    @Transactional(readOnly = true)
    public List<QuestionCardResponse> getQuestionCardsBySprint(Long sprintId) {
        return questionCardRepository.findBySprintId(sprintId)
                .stream()
                .map(QuestionCardResponse::from)
                .collect(Collectors.toList());
    }

    public QuestionCardResponse updateQuestionCard(Long id, QuestionCardRequest request, Long userId) {
        QuestionCard questionCard = questionCardRepository.findById(id)
                .orElseThrow(QuestionCardNotFoundException::new);

        List<Team> userTeams = userTeamRepository.findTeamsByUserId(userId);

        boolean isAuthorized = userTeams.stream()
                .anyMatch(team -> team.equals(questionCard.getTeam()));

        if (!isAuthorized) {
            throw new UnauthorizedTeamException();
        }

        questionCard.updateDescription(request.getDescription());

        return QuestionCardResponse.from(questionCard);
    }

    public void deleteQuestionCard(Long id, Long userId) {
        QuestionCard questionCard = questionCardRepository.findById(id)
                .orElseThrow(QuestionCardNotFoundException::new);

        List<Team> userTeams = userTeamRepository.findTeamsByUserId(userId);

        boolean isAuthorized = userTeams.stream()
                .anyMatch(team -> team.equals(questionCard.getTeam()));

        if (!isAuthorized) {
            throw new UnauthorizedTeamException();
        }

        questionCardRepository.delete(questionCard);
    }

    public QuestionCardResponse selectQuestionCardsBySprintAndQuestionId(Long sprintId, Long questionId) {
        Sprint sprint = sprintRepository.findById(sprintId).orElseThrow(SprintNotExistException::new);

        if (!isQuestionCardSelectionAllowed(sprint)) {
            throw new InvalidPresentationStatusException();
        }
        QuestionCard card = questionCardRepository.findById(questionId).orElseThrow(QuestionCardNotFoundException::new);
        card.update();
        return QuestionCardResponse.from(card);
    }

    private boolean isQuestionCardSelectionAllowed(Sprint sprint) {
        return sprint.getPresentationStatus() == PresentationStatus.QUESTION_READY ||
                sprint.getPresentationStatus() == PresentationStatus.QUESTION_ANSWER ||
                sprint.getPresentationStatus() == PresentationStatus.QUESTION_ANSWERER_INTRO;
    }
}

