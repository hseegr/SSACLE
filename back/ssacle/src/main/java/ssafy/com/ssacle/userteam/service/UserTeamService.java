package ssafy.com.ssacle.userteam.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.exception.UserNotInTeamException;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.userteam.repository.UserTeamRepository;

@Service
@RequiredArgsConstructor
public class UserTeamService {
    private final UserTeamRepository userTeamRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public void isUserInTeam(Long userId, Long teamId) {
        boolean isUserParticipatedInTeam = userTeamRepository.existsByUserIdAndTeamId(userId, teamId);

        if(!isUserParticipatedInTeam){
            throw new UserNotInTeamException();
        }
    }

    @Transactional
    public void addPickleToTeamUsers(Team team){
        team.getUserTeams().forEach(userTeam -> {
            User user = userTeam.getUser();
            user.setPickles(user.getPickles() + 100);
            userRepository.save(user);
        });
    }
}
