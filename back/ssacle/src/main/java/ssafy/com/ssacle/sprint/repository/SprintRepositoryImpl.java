package ssafy.com.ssacle.sprint.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import ssafy.com.ssacle.SprintCategory.domain.QSprintCategory;
import ssafy.com.ssacle.category.domain.QCategory;
import ssafy.com.ssacle.sprint.domain.QSprint;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.team.domain.QTeam;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.userteam.domain.QUserTeam;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class SprintRepositoryImpl implements SprintRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Optional<Sprint> findByIdWithTeams(Long sprintId) {
        QSprint sprint = QSprint.sprint;
        QTeam team = QTeam.team;

        Sprint result = queryFactory
                .selectFrom(sprint)
                .leftJoin(sprint.teams, team).fetchJoin()
                .where(sprint.id.eq(sprintId))
                .fetchOne();

        return Optional.ofNullable(result);
    }

    @Override
    public Page<Sprint> findSprintsByStatus(Integer status, Pageable pageable) {
        QSprint sprint = QSprint.sprint;
        QSprintCategory sprintCategory = QSprintCategory.sprintCategory;
        QCategory category = QCategory.category;

        List<Sprint> results = queryFactory
                .select(sprint)
                .from(sprint)
                .leftJoin(sprint.sprintCategories, sprintCategory).fetchJoin()
                .leftJoin(sprintCategory.category, category).fetchJoin()
                .where(sprint.status.eq(status).and(sprint.ssaldCup.id.isNull()))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(sprint.count())
                .from(sprint)
                .where(sprint.status.eq(status).and(sprint.ssaldCup.id.isNull()))
                .fetchOne();

        return PageableExecutionUtils.getPage(results, pageable, () -> total == null ? 0 : total);
    }

    @Override
    public Page<Sprint> findSprintsByCategoryAndStatus(Long categoryId, Integer status, Pageable pageable) {
        QSprint sprint = QSprint.sprint;
        QSprintCategory sprintCategory = QSprintCategory.sprintCategory;
        QCategory category = QCategory.category;

        List<Sprint> results = queryFactory
                .selectDistinct(sprint)
                .from(sprint)
                .join(sprint.sprintCategories, sprintCategory)
                .join(sprintCategory.category, category)
                .where(category.id.eq(categoryId)
                        .and(sprint.status.eq(status)).and(sprint.ssaldCup.id.isNull()))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(sprint.countDistinct())
                .from(sprint)
                .join(sprint.sprintCategories, sprintCategory)
                .join(sprintCategory.category, category)
                .where(category.id.eq(categoryId)
                        .and(sprint.status.eq(status).and(sprint.ssaldCup.id.isNull())))
                .fetchOne();

        return PageableExecutionUtils.getPage(results, pageable, () -> total == null ? 0 : total);
    }

    @Override
    public Page<Sprint> findUserParticipatedSprints(User user, List<Integer> statuses, Pageable pageable) {
        QSprint sprint = QSprint.sprint;
        QTeam team = QTeam.team;
        QUserTeam userTeam = QUserTeam.userTeam;

        // ✅ fetch join 제거, Sprint만 조회
        List<Sprint> results = queryFactory
                .select(sprint)
                .from(sprint)
                .where(sprint.status.in(statuses)
                        .and(sprint.id.in(
                                queryFactory.select(team.sprint.id)
                                        .from(team)
                                        .where(team.id.in(
                                                queryFactory.select(userTeam.team.id)
                                                        .from(userTeam)
                                                        .where(userTeam.user.eq(user))
                                        ))
                        ))
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = Optional.ofNullable(queryFactory
                .select(sprint.count())
                .from(sprint)
                .where(sprint.id.in(
                        queryFactory.select(team.sprint.id)
                                .from(team)
                                .where(team.id.in(
                                        queryFactory.select(userTeam.team.id)
                                                .from(userTeam)
                                                .where(userTeam.user.eq(user))
                                ))
                ).and(sprint.status.in(statuses)))
                .fetchOne()).orElse(0L);

        return PageableExecutionUtils.getPage(results, pageable, () -> total);
    }

    @Override
    public Long findTeamIdBySprintAndUser(Sprint sprint, User user) {
        QUserTeam userTeam = QUserTeam.userTeam;

        return queryFactory
                .select(userTeam.team.id)
                .from(userTeam)
                .where(userTeam.user.eq(user)
                        .and(userTeam.team.sprint.eq(sprint)))
                .fetchOne();
    }

}
