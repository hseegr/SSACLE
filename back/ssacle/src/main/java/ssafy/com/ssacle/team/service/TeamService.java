package ssafy.com.ssacle.team.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.board.domain.Board;
import ssafy.com.ssacle.board.dto.BoardResponseDTO;
import ssafy.com.ssacle.board.exception.BoardErrorCode;
import ssafy.com.ssacle.board.exception.BoardException;
import ssafy.com.ssacle.sprint.exception.UserParticipatedException;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.dto.TeamDiaryResponse;
import ssafy.com.ssacle.team.dto.TeamResponseDTO;
import ssafy.com.ssacle.team.exception.TeamNotFoundException;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.dto.UserResponse;
import ssafy.com.ssacle.user.exception.PickleNotEnoughException;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.userboard.domain.UserBoard;
import ssafy.com.ssacle.userteam.domain.UserTeam;
import ssafy.com.ssacle.userteam.repository.UserTeamRepository;

import java.util.List;
import java.util.stream.Collectors;

import static ssafy.com.ssacle.user.exception.UpdateProfileErrorCode.PICKLE_NOT_ENOUGH;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final UserTeamRepository userTeamRepository;

    public List<Long> getTeamMembers(Long teamId){
        Team team = teamRepository.findById(teamId)
                .orElseThrow(TeamNotFoundException::new);

        return userRepository.findUsersIdByTeamId(team.getId());
    }


    public List<TeamResponseDTO> getTeamsBySprintId(Long sprintId) {
        List<Team> teams = teamRepository.findBySprintId(sprintId);
        return teams.stream()
                .map(TeamResponseDTO::from)
                .collect(Collectors.toList());
    }

    public Team findById(Long teamId){
        return teamRepository.findByIdWithUserTeams(teamId)
                .orElseThrow(TeamNotFoundException::new);
    }

    public Page<TeamDiaryResponse> getAllTeamsWithDiaries(Pageable pageable) {
        return teamRepository.findTeamsWithDiaries(pageable);
    }

    @Transactional
    public String purchaseTeam(User user, Long teamId) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(TeamNotFoundException::new);

        boolean alreadyJoined = userTeamRepository.existsByUserIdAndTeamId(user.getId(), team.getId());
        if (alreadyJoined) {
            throw new UserParticipatedException();
        }

        team.addUser(user);
        if (user.getPickles() < 7) {
            throw new PickleNotEnoughException(PICKLE_NOT_ENOUGH);
        }

        user.setPickles(user.getPickles()-7);
        userRepository.save(user);

        return team.getNotionURL();
    }
}
