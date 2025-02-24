package ssafy.com.ssacle.match.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import ssafy.com.ssacle.match.domain.Game;
import ssafy.com.ssacle.match.domain.QGame;
import ssafy.com.ssacle.ssaldcup.domain.QSsaldCup;

import java.util.List;

@RequiredArgsConstructor
public class GameRepositoryImpl implements GameRepositoryCustom{
    private final JPAQueryFactory queryFactory;

    @Override
    public List<Game> findBySsaldCupIdAndWeek(Long ssaldCupId, Integer week) {
        QGame game = QGame.game;
        QSsaldCup ssaldCup = QSsaldCup.ssaldCup;

        return queryFactory
                .selectFrom(game)
                .leftJoin(game.ssaldCup, ssaldCup).fetchJoin()  // Fetch Join 적용
                .where(game.ssaldCup.id.eq(ssaldCupId).and(game.week.eq(week)))
                .fetch();
    }
}
