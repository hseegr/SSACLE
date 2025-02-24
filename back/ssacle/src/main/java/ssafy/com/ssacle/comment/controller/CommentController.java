package ssafy.com.ssacle.comment.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.comment.domain.Comment;
import ssafy.com.ssacle.comment.dto.CommentRequestDTO;
import ssafy.com.ssacle.comment.dto.CommentResponseDTO;
import ssafy.com.ssacle.comment.service.CommentService;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comment")
@RequiredArgsConstructor
public class CommentController implements  CommentSwaggerController{
    private final CommentService commentService;
    private final UserService userService;

    @Override
    public ResponseEntity<List<CommentResponseDTO>> getCommentsByBoard(Long boardId) {
        return ResponseEntity.ok().body(commentService.getCommentsByBoard(boardId));
    }

    @Override
    public ResponseEntity<Void> createComment(Long boardId, CommentRequestDTO commentRequestDTO) {
        User user = userService.getAuthenticatedUser();
        commentService.createComment(boardId,commentRequestDTO,user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Override
    public ResponseEntity<Void> updateComment(Long commentId, CommentRequestDTO commentRequestDTO) {
        User user = userService.getAuthenticatedUser();
        commentService.updateComment(commentId,commentRequestDTO,user);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> deleteComment(Long commentId) {
        User user = userService.getAuthenticatedUser();
        commentService.deleteComment(commentId, user);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> createReply(Long parentCommentId, CommentRequestDTO commentRequestDTO) {
        User user = userService.getAuthenticatedUser();
        commentService.createReply(parentCommentId, commentRequestDTO, user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Override
    public ResponseEntity<List<CommentResponseDTO>> getReplies(Long parentCommentId) {
        return ResponseEntity.ok().body(commentService.getReplies(parentCommentId));
    }
}
