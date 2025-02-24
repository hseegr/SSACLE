package ssafy.com.ssacle.vote.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.service.UserService;
import ssafy.com.ssacle.vote.dto.VoteRequestDTO;
import ssafy.com.ssacle.vote.dto.VoteResponseDTO;
import ssafy.com.ssacle.vote.service.VoteService;

@RestController
@RequestMapping("/api/v1/vote")
@RequiredArgsConstructor
@Slf4j
public class VoteController implements VoteSwaggerController {
    private final VoteService voteService;
    private final UserService userService;

    @Override
    public ResponseEntity<VoteResponseDTO> castVote(@RequestBody VoteRequestDTO voteRequest) {
        User user = userService.getAuthenticatedUser();
        Long voteId = voteService.castVote(voteRequest, user);
        return ResponseEntity.ok(new VoteResponseDTO("투표가 완료되었습니다.", voteId));
    }

}
