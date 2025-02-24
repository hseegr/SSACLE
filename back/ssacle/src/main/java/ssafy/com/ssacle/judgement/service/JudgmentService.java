package ssafy.com.ssacle.judgement.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.com.ssacle.judgement.domain.Judgment;
import ssafy.com.ssacle.judgement.dto.JudgmentRequest;
import ssafy.com.ssacle.judgement.dto.JudgmentResponse;
import ssafy.com.ssacle.judgement.repository.JudgmentRepository;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.sprint.exception.SprintNotExistException;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.service.UserService;

@Service
@RequiredArgsConstructor
@Transactional
public class JudgmentService {
    private final JudgmentRepository judgmentRepository;
    private final SprintRepository sprintRepository;
    private final UserService userService;

    public JudgmentResponse applyJudgment(JudgmentRequest request) {
        User user = userService.getAuthenticatedUser();
        Sprint sprint = sprintRepository.findById(request.getSprintId())
                .orElseThrow(SprintNotExistException::new);

        if (judgmentRepository.findBySprint(sprint).isPresent()) {
            throw new IllegalStateException("이미 심판이 지정된 스프린트입니다.");
        }

        Judgment judgment = Judgment.builder().user(user).sprint(sprint).build();
        return JudgmentResponse.from(judgmentRepository.save(judgment));
    }

    @Transactional(readOnly = true)
    public JudgmentResponse getJudgmentBySprint(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(SprintNotExistException::new);

        Judgment judgment = judgmentRepository.findBySprint(sprint)
                .orElseThrow(() -> new IllegalStateException("해당 스프린트에 심판이 없습니다."));

        return JudgmentResponse.from(judgment);
    }

    public void cancelJudgment(Long sprintId) {
        User user = userService.getAuthenticatedUser();
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(SprintNotExistException::new);

        judgmentRepository.deleteByUserAndSprint(user, sprint);
    }
}