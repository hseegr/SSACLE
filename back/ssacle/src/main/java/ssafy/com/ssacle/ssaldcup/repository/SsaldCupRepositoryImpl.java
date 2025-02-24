package ssafy.com.ssacle.ssaldcup.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import ssafy.com.ssacle.category.domain.QCategory;
import ssafy.com.ssacle.ssaldcup.domain.QSsaldCup;
import ssafy.com.ssacle.ssaldcup.domain.SsaldCup;
import ssafy.com.ssacle.ssaldcupcategory.domain.QSsaldCupCategory;
import ssafy.com.ssacle.team.domain.QTeam;
import ssafy.com.ssacle.user.domain.QUser;
import ssafy.com.ssacle.userteam.domain.QUserTeam;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class SsaldCupRepositoryImpl implements SsaldCupRepositoryCustom{
    private final JPAQueryFactory queryFactory;

    @Override
    public Page<SsaldCup> findBySsaldCupsByStatus(Integer status, Pageable pageable) {
        QSsaldCup ssaldCup = QSsaldCup.ssaldCup;
        QSsaldCupCategory ssaldCupCategory = QSsaldCupCategory.ssaldCupCategory;
        QCategory category = QCategory.category;

        List<SsaldCup> results = queryFactory
                .select(ssaldCup)
                .from(ssaldCup)
                .leftJoin(ssaldCup.ssaldCupCategories, ssaldCupCategory).fetchJoin()
                .leftJoin(ssaldCupCategory.category, category).fetchJoin()
                .where(ssaldCup.status.eq(status))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = Optional.ofNullable(queryFactory
                .select(ssaldCup.count())
                .from(ssaldCup)
                .leftJoin(ssaldCup.ssaldCupCategories, ssaldCupCategory)
                .leftJoin(ssaldCupCategory.category,category)
                .where(ssaldCup.status.eq(status))
                .fetchOne()).orElse(0L);

        return PageableExecutionUtils.getPage(results, pageable, ()->total);
    }

    @Override
    public Page<SsaldCup> findSsaldCupsByCategoryAndStatus(Long categoryId, Integer status, Pageable pageable) {
        QSsaldCup ssaldCup = QSsaldCup.ssaldCup;
        QSsaldCupCategory ssaldCupCategory = QSsaldCupCategory.ssaldCupCategory;
        QCategory category = QCategory.category;

        List<SsaldCup> results = queryFactory
                .select(ssaldCup)
                .from(ssaldCup)
                .leftJoin(ssaldCup.ssaldCupCategories, ssaldCupCategory).fetchJoin()
                .leftJoin(ssaldCupCategory.category, category).fetchJoin()
                .where(category.id.eq(categoryId).and(ssaldCup.status.eq(status)))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = Optional.ofNullable(queryFactory
                .select(ssaldCup.count())
                .from(ssaldCup)
                .leftJoin(ssaldCup.ssaldCupCategories, ssaldCupCategory)
                .leftJoin(ssaldCupCategory.category,category)
                .where(category.id.eq(categoryId).and(ssaldCup.status.eq(status)))
                .fetchOne()).orElse(0L);

        return PageableExecutionUtils.getPage(results, pageable, ()->total);
    }
}
