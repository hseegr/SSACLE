package ssafy.com.ssacle.comment.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ssafy.com.ssacle.comment.domain.Comment;
import ssafy.com.ssacle.board.domain.Board;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 전체 댓글을 생성일 기준 내림차순으로 조회
    @Query("SELECT c FROM Comment c JOIN FETCH c.board b JOIN FETCH b.user WHERE b.id = :boardId AND c.parent IS NULL ORDER BY c.createdAt DESC")
    List<Comment> findTopLevelComments(@Param("boardId") Long boardId);

    // 특정 부모 댓글에 대한 대댓글 조회 (최신순)
    @Query("SELECT c FROM Comment c JOIN FETCH c.user WHERE c.parent.id = :parentId ORDER BY c.createdAt DESC")
    List<Comment> findByParentOrderByCreatedAtDesc(@Param("parentId") Long parentId);

    @Query("SELECT c FROM Comment c where c.parent.id=:parentId")
    List<Comment> findByParent(@Param("parentId") Long parentId);
    @Transactional
    @Modifying
    @Query("UPDATE Comment c SET c.content = :content, c.updatedAt = :updatedAt WHERE c.id = :id")
    void updateComment(@Param("id") Long id, @Param("content") String content, @Param("updatedAt") LocalDateTime updatedAt);

    // 댓글 삭제
    void deleteById(Long id);
}
