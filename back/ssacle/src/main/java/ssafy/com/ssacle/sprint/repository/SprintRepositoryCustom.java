package ssafy.com.ssacle.sprint.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.user.domain.User;

import java.util.List;
import java.util.Optional;

public interface SprintRepositoryCustom {
    Optional<Sprint> findByIdWithTeams(Long sprintId);
    Page<Sprint> findSprintsByStatus(Integer status, Pageable pageable);
    Page<Sprint> findSprintsByCategoryAndStatus(Long categoryId, Integer status, Pageable pageable);
    Page<Sprint> findUserParticipatedSprints(User user, List<Integer> statuses, Pageable pageable);

    // ✅ teamId 조회 메서드 추가
    Long findTeamIdBySprintAndUser(Sprint sprint, User user);
}
