package ssafy.com.ssacle.user.repository;

import ssafy.com.ssacle.sprint.dto.SprintSummaryResponse;
import ssafy.com.ssacle.user.domain.User;

import java.util.List;

public interface UserRepositoryCustom {
    List<SprintSummaryResponse> findParticipatedSprints(User user);
}
