package ssafy.com.ssacle.board.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ssafy.com.ssacle.board.domain.BoardType;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardTypeRepository extends JpaRepository<BoardType, Long> {

    @Query("SELECT bt FROM BoardType bt WHERE bt.name = :name")
    Optional<BoardType> findByName(String name);

    @Query("SELECT bt FROM BoardType bt WHERE bt.parent.name = :name1 AND bt.name = :name2")
    Optional<BoardType> findByNameAndParentName(String name1, String name2);

    @Query("SELECT b.boardType.name, COUNT(b) FROM Board b GROUP BY b.boardType.name")
    List<Object[]> countBoardsByBoardType();

}
