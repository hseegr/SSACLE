package ssafy.com.ssacle.team.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import ssafy.com.ssacle.SprintCategory.domain.QSprintCategory;
import ssafy.com.ssacle.category.domain.QCategory;
import ssafy.com.ssacle.diary.domain.QDiary;
import ssafy.com.ssacle.sprint.domain.QSprint;
import ssafy.com.ssacle.team.domain.QTeam;
import ssafy.com.ssacle.team.dto.TeamDiaryResponse;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class TeamRepositoryImpl implements TeamRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<TeamDiaryResponse> findTeamsWithDiaries(Pageable pageable) {
        QTeam team = QTeam.team;
        QDiary diary = QDiary.diary;
        QSprint sprint = QSprint.sprint;
        QSprintCategory sprintCategory = QSprintCategory.sprintCategory;
        QCategory category = QCategory.category;

        List<Long> teamIds = queryFactory
                .select(team.id)
                .from(team)
                .leftJoin(team.sprint, sprint)
                .where(sprint.status.eq(2))
                .orderBy(team.id.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        if (teamIds.isEmpty()) {
            return Page.empty(pageable);
        }

        List<TeamDiaryResponse> results = queryFactory
                .select(Projections.constructor(TeamDiaryResponse.class,
                        team.id,
                        team.name,
                        sprint.name,
                        category.categoryName,
                        diary.content
                ))
                .from(team)
                .leftJoin(diary).on(diary.team.eq(team))
                .leftJoin(team.sprint, sprint)
                .leftJoin(sprint.sprintCategories, sprintCategory)
                .leftJoin(sprintCategory.category, category)
                .where(team.id.in(teamIds))
                .orderBy(team.id.asc())
                .fetch();

        Map<Long, TeamDiaryResponse> groupedResults = results.stream()
                .collect(Collectors.toMap(
                        TeamDiaryResponse::getTeamId,
                        response -> response,
                        (existing, newEntry) -> {
                            if (newEntry.getDiaries() != null && !newEntry.getDiaries().isEmpty()) {
                                existing.addDiaryContent(newEntry.getDiaries().get(0));
                            }
                            if (newEntry.getCategoryNames() != null && !newEntry.getCategoryNames().isEmpty()) {
                                existing.addCategoryName(newEntry.getCategoryNames().get(0));
                            }
                            return existing;
                        }
                ));

        Long total = queryFactory
                .select(team.count())
                .from(team)
                .leftJoin(team.sprint, sprint)
                .where(sprint.status.eq(2))
                .fetchOne();

        return PageableExecutionUtils.getPage(List.copyOf(groupedResults.values()), pageable, () -> total == null ? 0 : total);
    }

}
