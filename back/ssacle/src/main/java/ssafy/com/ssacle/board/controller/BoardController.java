package ssafy.com.ssacle.board.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.board.domain.Board;
import ssafy.com.ssacle.board.dto.BoardRequestDTO;
import ssafy.com.ssacle.board.dto.BoardResponseDTO;
import ssafy.com.ssacle.board.dto.BoardUpdateRequestDTO;
import ssafy.com.ssacle.board.service.BoardService;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/board")
@RequiredArgsConstructor
@Slf4j
public class BoardController implements BoardSwaggerController{
    private final BoardService boardService;
    private final UserService userService;

    @Override
    public ResponseEntity<List<BoardResponseDTO>> getAllBoards() {
        return ResponseEntity.ok().body(boardService.getAllBoards());
    }

    @Override
    public ResponseEntity<List<BoardResponseDTO>> getBoardsbyBoardTypeName(String name) {
        return ResponseEntity.ok().body(boardService.getBoardsbyBoardTypeName(name));
    }


    @Override
    public ResponseEntity<BoardResponseDTO> getBoardById(Long boardId) {
        return ResponseEntity.ok().body(boardService.getBoardById(boardId));
    }

    @Override
    public ResponseEntity<Void> saveBoard(BoardRequestDTO boardRequestDTO) {
        User user = userService.getAuthenticatedUser();
        boardService.saveBoard(boardRequestDTO,user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Override
    public ResponseEntity<Void> deleteBoard(Long boardId) {
        User user = userService.getAuthenticatedUser();
        boardService.deleteBoard(boardId, user);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> updateBoard(Long boardId, BoardUpdateRequestDTO boardUpdateRequestDTO) {
        User user = userService.getAuthenticatedUser();
        log.info("{}, {}", user.getName(), user.getNickname());
        boardService.updateBoard(boardId, boardUpdateRequestDTO,user);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Integer> countBoard(String boardTypeName) {
        return ResponseEntity.ok().body(boardService.countBoardsByBoardTypeName(boardTypeName));
    }

    @Override
    public ResponseEntity<Page<BoardResponseDTO>> getAllBoardsPaged(Pageable pageable) {
        Long userId = userService.getAuthenticatedUser().getId();

        return ResponseEntity.ok().body(boardService.getAllBoards(userId, pageable));
    }

    @Override
    public ResponseEntity<Page<BoardResponseDTO>> getBoardsByBoardTypePaged(String name, Pageable pageable) {
        Long userId = userService.getAuthenticatedUser().getId();

        return ResponseEntity.ok().body(boardService.getBoardsByBoardTypeName(name, userId, pageable));
    }

    @Override
    public ResponseEntity<BoardResponseDTO> purchaseBoard(@PathVariable Long boardId) {
        User user = userService.getAuthenticatedUserWithPurchasedBoards();
        return ResponseEntity.ok(boardService.buyBoard(user, boardId));
    }
}
