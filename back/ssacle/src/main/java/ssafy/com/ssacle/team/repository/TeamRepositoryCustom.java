package ssafy.com.ssacle.team.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ssafy.com.ssacle.team.dto.TeamDiaryResponse;

public interface TeamRepositoryCustom {
    Page<TeamDiaryResponse> findTeamsWithDiaries(Pageable pageable);
}
