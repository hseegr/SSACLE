package ssafy.com.ssacle.board.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ssafy.com.ssacle.board.domain.Board;

public interface BoardRepositoryCustom {
    Page<Board> findAllWithPagination(Pageable pageable);
    Page<Board> findByBoardTypeId(Long boardTypeId, Pageable pageable);
}
