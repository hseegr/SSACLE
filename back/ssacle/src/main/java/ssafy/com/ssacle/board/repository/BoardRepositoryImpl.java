package ssafy.com.ssacle.board.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import ssafy.com.ssacle.board.domain.Board;
import ssafy.com.ssacle.board.domain.QBoard;

import java.util.List;

@RequiredArgsConstructor
public class BoardRepositoryImpl implements BoardRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Board> findAllWithPagination(Pageable pageable) {
        QBoard board = QBoard.board;

        List<Board> content = queryFactory
                .selectFrom(board)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(board.createdAt.desc())  // 기본 정렬 조건
                .fetch();

        long total = queryFactory
                .selectFrom(board)
                .fetchCount();

        return PageableExecutionUtils.getPage(content, pageable, () -> total);
    }

    @Override
    public Page<Board> findByBoardTypeId(Long boardTypeId, Pageable pageable) {
        QBoard board = QBoard.board;

        List<Board> content = queryFactory
                .selectFrom(board)
                .where(board.boardType.id.eq(boardTypeId))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(board.createdAt.desc())  // 정렬 기준 추가 가능
                .fetch();

        long total = queryFactory
                .selectFrom(board)
                .where(board.boardType.id.eq(boardTypeId))
                .fetchCount();

        return PageableExecutionUtils.getPage(content, pageable, () -> total);
    }
}
