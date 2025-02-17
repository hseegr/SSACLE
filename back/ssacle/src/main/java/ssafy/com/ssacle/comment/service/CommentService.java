package ssafy.com.ssacle.comment.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssafy.com.ssacle.board.domain.Board;
import ssafy.com.ssacle.board.exception.BoardErrorCode;
import ssafy.com.ssacle.board.exception.BoardException;
import ssafy.com.ssacle.board.repository.BoardRepository;
import ssafy.com.ssacle.comment.domain.Comment;
import ssafy.com.ssacle.comment.dto.CommentRequestDTO;
import ssafy.com.ssacle.comment.dto.CommentResponseDTO;
import ssafy.com.ssacle.comment.exception.CommentErrorCode;
import ssafy.com.ssacle.comment.exception.CommentException;
import ssafy.com.ssacle.comment.repository.CommentRepository;
import ssafy.com.ssacle.global.jwt.JwtTokenUtil;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.user.service.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {
    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;

    /** 📌 1. 특정 게시글의 댓글 조회 (최신순) */
    @Transactional
    public List<CommentResponseDTO> getCommentsByBoard(Long boardId) {
        List<Comment> commentList = commentRepository.findTopLevelComments(boardId);

        return commentList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
//        List<CommentResponseDTO> responseDTOList = new ArrayList<>();
//        for(Comment comment : commentList){
//            User user = userRepository.findById(comment.getUser().getId()).orElseThrow(() -> new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));
//            CommentResponseDTO commentResponseDTO = CommentResponseDTO.builder()
//                    .content(comment.getContent())
//                    .writerInfo(comment.getUser().getNickname())
//                    .time(comment.getCreatedAt())
//                    .build();
//            responseDTOList.add(commentResponseDTO);
//        }
//        Collections.sort(responseDTOList, (o1, o2) -> o2.getTime().compareTo(o1.getTime()));
//        return responseDTOList;
    }

    /** 📌 2. 댓글 작성 */
    @Transactional
    public Comment createComment(Long boardId, CommentRequestDTO commentRequestDTO, User user) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new CommentException(CommentErrorCode.BOARD_NOT_FOUND));

        validateCommentContent(commentRequestDTO.getContent());

        Comment comment = Comment.builder()
                .user(user)
                .board(board)
                .parent(null)
                .content(commentRequestDTO.getContent())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .disclosure(true)
                .build();

        return commentRepository.save(comment);
    }

    /** 📌 3. 댓글 수정 */
    @Transactional
    public void updateComment(Long commentId, CommentRequestDTO commentRequestDTO, User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CommentException(CommentErrorCode.COMMENT_NOT_FOUND));


        if(!comment.getUser().getId().equals(user.getId())) {
            throw new CommentException(CommentErrorCode.COMMENT_UPDATE_FORBIDDEN);
        }

        validateCommentContent(commentRequestDTO.getContent());

        commentRepository.updateComment(commentId,commentRequestDTO.getContent(), LocalDateTime.now());
    }

    /** 📌 4. 댓글 삭제 */
    @Transactional
    public void deleteComment(Long commentId, User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BoardException(BoardErrorCode.BOARD_NOT_FOUND));

        if(!comment.getUser().getId().equals(user.getId())) {
            throw new CommentException(CommentErrorCode.COMMENT_UPDATE_FORBIDDEN);
        }

        commentRepository.deleteById(commentId);
    }

    /** 📌 5. 대댓글 작성 */
    @Transactional
    public Comment createReply(Long parentCommentId, CommentRequestDTO commentRequestDTO, User user) {
        // 부모 댓글 조회 (존재하지 않으면 예외 발생)
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new BoardException(BoardErrorCode.BOARD_NOT_FOUND));

        // 부모 댓글과 같은 게시글을 가져옴
        Board board = parentComment.getBoard();

        validateCommentContent(commentRequestDTO.getContent());

        // 대댓글 생성
        Comment reply = Comment.builder()
                .user(user)
                .board(board)
                .parent(parentComment) // 부모 댓글 설정
                .content(commentRequestDTO.getContent())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .disclosure(true)
                .build();

        return commentRepository.save(reply);
    }

    /** 📌 6. 특정 댓글의 대댓글 조회 */
    @Transactional(readOnly = true)
    public List<CommentResponseDTO> getReplies(Long parentCommentId) {
//        Comment parentComment = commentRepository.findById(parentCommentId)
//                .orElseThrow(() -> new CommentException(CommentErrorCode.PARENT_COMMENT_NOT_FOUND));
//        System.out.println(parentComment.get)
        System.out.println("상위 아이디 : "+parentCommentId);
        List<Comment> replies = commentRepository.findByParentOrderByCreatedAtDesc(parentCommentId);
        System.out.println("대댓글 갯수 : "+replies.size());
        return replies.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    private CommentResponseDTO convertToDTO(Comment comment) {
        List<CommentResponseDTO> childComments = commentRepository.findByParentOrderByCreatedAtDesc(comment.getId())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return CommentResponseDTO.builder()
                .content(comment.getContent())
                .writerInfo(comment.getUser().getNickname())  // ✅ 변경
                .time(comment.getCreatedAt())
                .child(childComments)
                .build();
    }


    private void validateCommentContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new CommentException(CommentErrorCode.COMMENT_CONTENT_EMPTY);
        }
        if (content.length() > 255) {
            throw new CommentException(CommentErrorCode.COMMENT_CONTENT_TOO_LONG);
        }
    }

}
