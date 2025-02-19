package ssafy.com.ssacle.ssaldcup.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.com.ssacle.category.domain.Category;
import ssafy.com.ssacle.category.repository.CategoryRepository;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.sprint.domain.SprintBuilder;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.ssaldcup.domain.SsaldCup;
import ssafy.com.ssacle.ssaldcup.domain.SsaldCupBuilder;
import ssafy.com.ssacle.ssaldcup.dto.*;
import ssafy.com.ssacle.ssaldcup.exception.SsaldCupAlreadyParticipateException;
import ssafy.com.ssacle.ssaldcup.exception.SsaldCupMaxTeamReachException;
import ssafy.com.ssacle.ssaldcup.exception.SsaldCupNotExistException;
import ssafy.com.ssacle.ssaldcup.repository.SsaldCupRepository;
import ssafy.com.ssacle.ssaldcupcategory.domain.SsaldCupCategory;
import ssafy.com.ssacle.ssaldcupcategory.repository.SsaldCupCategoryRepository;
import ssafy.com.ssacle.team.domain.SsaldCupTeamBuilder;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.repository.UserRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SsaldCupService {
    private final SsaldCupRepository ssaldCupRepository;
    private final CategoryRepository categoryRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final SsaldCupCategoryRepository ssaldCupCategoryRepository;
    private final SprintRepository sprintRepository;

    @Transactional
    public SsaldCupCreateResponseDTO createSsaldCup(SsaldCupCreateRequestDTO ssaldCupCreateRequestDTO){
        SsaldCup ssaldCup = SsaldCupBuilder.builder()
                .name(ssaldCupCreateRequestDTO.getName())
                .basicDescription(ssaldCupCreateRequestDTO.getBasicDescription())
                .detailDescription(ssaldCupCreateRequestDTO.getDetailDescription())
                .maxTeams(ssaldCupCreateRequestDTO.getMaxTeams())
                .maxTeamMembers(ssaldCupCreateRequestDTO.getMaxTeamMembers())
                .startAt(ssaldCupCreateRequestDTO.getStartAt())
                .endAt(ssaldCupCreateRequestDTO.getEndAt())
                .build();
        ssaldCupRepository.save(ssaldCup);
        if(ssaldCupCreateRequestDTO.getCategoryIds()!=null && !ssaldCupCreateRequestDTO.getCategoryIds().isEmpty()){
            List<Category> categoryList = categoryRepository.findAllById(ssaldCupCreateRequestDTO.getCategoryIds());
            categoryList.forEach(category -> {
                SsaldCupCategory ssaldCupCategory = new SsaldCupCategory(ssaldCup, category);
                ssaldCupCategoryRepository.save(ssaldCupCategory);
            });
        }
        if (ssaldCupCreateRequestDTO.getSprints() != null && !ssaldCupCreateRequestDTO.getSprints().isEmpty()) {
            AtomicInteger sequence = new AtomicInteger(1);
            List<Sprint> sprints = ssaldCupCreateRequestDTO.getSprints().stream()
                    .map(sprintRequest -> SprintBuilder.builder()
                            .name(sprintRequest.getName())
                            .basicDescription(sprintRequest.getBasicDescription())
                            .detailDescription(sprintRequest.getDetailDescription())
                            .recommendedFor(sprintRequest.getRecommendedFor())
                            .startAt(sprintRequest.getStartAt())
                            .endAt(sprintRequest.getEndAt())
                            .announceAt(sprintRequest.getAnnounceAt())
                            .maxMembers(sprintRequest.getMaxMembers())
                            .sequence(sequence.getAndIncrement())
                            .ssaldCup(ssaldCup)
                            .defaultTodos(sprintRequest.getTodos())
                            .build())
                    .collect(Collectors.toList());

            sprintRepository.saveAll(sprints);
        }
        return new SsaldCupCreateResponseDTO("싸드컵이 성공적으로 생성되었습니다.", ssaldCup.getId());
    }

    @Transactional
    public void joinSsaldCup(Long ssaldCupId, User user) {
        // SsaldCup 조회
        SsaldCup ssaldCup = ssaldCupRepository.findById(ssaldCupId)
                .orElseThrow(SsaldCupNotExistException::new);

        if (userAlreadyJoined(ssaldCup, user)) {
            throw new SsaldCupAlreadyParticipateException();
        }

        List<Team> teams = teamRepository.findBySsaldCupId(ssaldCupId);

        Team team;
        if (teams.isEmpty() || teams.get(teams.size() - 1).getCurrentMembers() >= ssaldCup.getMaxTeamMembers()) {
            // 새로운 팀 생성
            if (ssaldCup.getCurrentTeams() >= ssaldCup.getMaxTeams()) {
                throw new SsaldCupMaxTeamReachException();
            }
            String teamName = "Team " + (teams.size() + 1);
            team = new Team(teamName, 0);
            team.setSsaldCup(ssaldCup);
            teamRepository.save(team);
            ssaldCup.setCurrentTeams(ssaldCup.getCurrentTeams() + 1);
            ssaldCupRepository.save(ssaldCup);
        } else {
            team = teams.get(teams.size() - 1);
        }

        user = loadUserWithTeams(user.getId());

        team.addUser(user);
        team.setCurrentMembers(team.getCurrentMembers() + 1);
    }

    @Transactional
    public User loadUserWithTeams(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Transactional(readOnly = true)
    public SingleSsaldCupResponseDTO getSsaldCupById(Long id) {
        SsaldCup ssaldCup = ssaldCupRepository.findById(id).orElseThrow(SsaldCupNotExistException::new);
        return SingleSsaldCupResponseDTO.from(ssaldCup);
    }

    @Transactional(readOnly = true)
    public Page<SsaldCupAndCategoriesResponseDTO> getSsaldCupsByStatus(Integer status, Pageable pageable) {
        return ssaldCupRepository.findBySsaldCupsByStatus(status, pageable)
                .map(SsaldCupAndCategoriesResponseDTO::from);
    }

    @Transactional(readOnly = true)
    public Page<SsaldCupAndCategoriesResponseDTO> getSsaldCupsByCategoryAndStatus(Long categoryId, Integer status, Pageable pageable) {
        return ssaldCupRepository.findSsaldCupsByCategoryAndStatus(categoryId, status, pageable)
                .map(SsaldCupAndCategoriesResponseDTO::from);
    }

    private boolean userAlreadyJoined(SsaldCup ssaldCup, User user) {
        return ssaldCup.getTeams().stream()
                .flatMap(team -> team.getUserTeams().stream())
                .anyMatch(userTeam -> userTeam.getUser().getId().equals(user.getId()));
    }

}
