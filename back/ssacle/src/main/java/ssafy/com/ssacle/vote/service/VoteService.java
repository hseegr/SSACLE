package ssafy.com.ssacle.vote.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.com.ssacle.lunch.exception.LunchErrorCode;
import ssafy.com.ssacle.lunch.exception.LunchException;
import ssafy.com.ssacle.lunch.repository.LunchRepository;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.vote.domain.Vote;
import ssafy.com.ssacle.vote.dto.VoteRequestDTO;
import ssafy.com.ssacle.vote.exception.VoteErrorCode;
import ssafy.com.ssacle.vote.exception.VoteException;
import ssafy.com.ssacle.vote.repository.VoteRepository;
import ssafy.com.ssacle.lunch.domain.Lunch;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final LunchRepository lunchRepository;

    @Transactional
    public Long  castVote(VoteRequestDTO voteRequest, User user) {
        LocalDateTime today = LocalDateTime.now().toLocalDate().atStartOfDay();
        // 점심 메뉴 조회
        Lunch lunch = lunchRepository.findById(voteRequest.getLunchId())
                .orElseThrow(() -> new LunchException(LunchErrorCode.NO_LUNCH_FOUND));

        // 이미 금일 투표했는지 확인
        if (voteRepository.existsByUserIdAndVoteDay(user.getId())) {
            throw new VoteException(VoteErrorCode.ALREADY_VOTED);
        }

        // 투표 생성 및 저장
        Vote vote = Vote.builder()
                .user(user)
                .lunch(lunch)
                .voteDay(today)
                .build();

        voteRepository.save(vote);
        return vote.getId();
    }
}
