package ssafy.com.ssacle.lunch.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.lunch.domain.Lunch;
import ssafy.com.ssacle.lunch.dto.LunchResponseDTO;
import ssafy.com.ssacle.lunch.dto.LunchUnvotedResponseDTO;
import ssafy.com.ssacle.lunch.dto.LunchVotedResponseDTO;
import ssafy.com.ssacle.lunch.repository.LunchRepository;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.vote.repository.VoteRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LunchService {
    private final LunchRepository lunchRepository;
    private final VoteRepository voteRepository;

    public List<LunchResponseDTO> getLunch(User user){
//        List<Lunch> lunches = lunchRepository.findByDay(today);
        System.out.println(user.getEmail()+" "+user.getName());
        List<Lunch> lunches = lunchRepository.findTodayLunch();
        boolean hasVoted = voteRepository.existsByUserIdAndVoteDay(user.getId());
        System.out.println(hasVoted);
        return lunches.stream()
                .map(lunch -> hasVoted ? getLunchAfterVote(lunch) : getLunchBeforeVote(lunch))
                .collect(Collectors.toList());
    }

    private LunchUnvotedResponseDTO getLunchBeforeVote(Lunch lunch) {
        return new LunchUnvotedResponseDTO(lunch);
    }

    private LunchVotedResponseDTO getLunchAfterVote(Lunch lunch) {
        long allVotes = voteRepository.countByVoteDay();
        long votes = voteRepository.countByLunchIdAndVoteDay(lunch.getId());
        double votePercentage = allVotes > 0 ? ((double) votes / allVotes) : 0.0;
        return new LunchVotedResponseDTO(lunch, votePercentage);
    }
}
