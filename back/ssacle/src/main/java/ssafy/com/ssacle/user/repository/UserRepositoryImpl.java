package ssafy.com.ssacle.user.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import ssafy.com.ssacle.sprint.dto.SprintSummaryResponse;
import ssafy.com.ssacle.sprint.domain.QSprint;
import ssafy.com.ssacle.team.domain.QTeam;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.userteam.domain.QUserTeam;

import java.util.List;

@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<SprintSummaryResponse> findParticipatedSprints(User user) {
        QSprint sprint = QSprint.sprint;
        QTeam team = QTeam.team;
        QUserTeam userTeam = QUserTeam.userTeam;

        return queryFactory
                .select(Projections.constructor(SprintSummaryResponse.class,
                        sprint.id,
                        sprint.name,
                        sprint.startAt,
                        sprint.endAt,
                        team.id // 사용자가 속한 팀 ID 추가
                ))
                .from(userTeam)
                .join(userTeam.team, team)
                .join(team.sprint, sprint)
                .where(userTeam.user.id.eq(user.getId()))
                .fetch();
    }
}
