package ssafy.com.ssacle.board.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.board.domain.Board;
import ssafy.com.ssacle.board.domain.BoardType;
import ssafy.com.ssacle.board.dto.BoardRequestDTO;
import ssafy.com.ssacle.board.dto.BoardResponseDTO;
import ssafy.com.ssacle.board.dto.BoardUpdateRequestDTO;
import ssafy.com.ssacle.board.exception.BoardErrorCode;
import ssafy.com.ssacle.board.exception.BoardException;
import ssafy.com.ssacle.board.repository.BoardRepository;
import ssafy.com.ssacle.board.repository.BoardTypeRepository;
import ssafy.com.ssacle.global.jwt.JwtTokenUtil;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.user.service.UserService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final BoardTypeRepository boardTypeRepository;
    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;


    /** 📌 1. 모든 게시글 목록 조회 */
    @Transactional
    public List<BoardResponseDTO> getAllBoards() {
        List<BoardResponseDTO> list = new ArrayList<>();
        List<Board> total = boardRepository.findAllWithUser();
        for(Board board : total){
            BoardResponseDTO boardResponseDTO = BoardResponseDTO.builder()
                    .title(board.getTitle())
                    .content(board.getContent())
                    .writerInfo(board.getUser().getNickname())
                    .time(board.getCreatedAt())
                    .tags(splitTags(board.getTag()))
                    .build();
            list.add(boardResponseDTO);
        }
        return list;
    }

    @Transactional
    public List<BoardResponseDTO> getBoardsbyBoardTypeName(String name) {
        BoardType boardType = boardTypeRepository.findByName(name)
                .orElseThrow(() -> new BoardException(BoardErrorCode.INVALID_BOARD_TYPE));
        List<Board> boards = boardRepository.findByBoardTypeId(boardType.getId());
        List<BoardResponseDTO> list = new ArrayList<>();

        for(Board board : boards){
            BoardResponseDTO boardResponseDTO = BoardResponseDTO.builder()
                    .title(board.getTitle())
                    .content(board.getContent())
                    .writerInfo(board.getUser().getNickname())
                    .time(board.getCreatedAt())
                    .tags(splitTags(board.getTag()))
                    .build();
            list.add(boardResponseDTO);
        }

        return list;
    }

    /** 📌 2. 게시글 상세 조회 */
    public BoardResponseDTO getBoardById(Long id) {
        Board board = boardRepository.findByIdWithUser(id).orElseThrow(() -> new BoardException(BoardErrorCode.BOARD_NOT_FOUND));

        BoardResponseDTO boardResponseDTO = BoardResponseDTO.builder()
                .title(board.getTitle())
                .content(board.getContent())
                .writerInfo(board.getUser().getNickname())
                .time(board.getCreatedAt())
                .tags(splitTags(board.getTag()))
                .build();
        return boardResponseDTO;

    }

    /** 📌 3. 게시글 저장 (토큰에서 email 추출 후 user 조회) */
    @Transactional
    public Board saveBoard(BoardRequestDTO boardRequestDTO, User user) {
        // 1. 제목 또는 내용이 비어 있는 경우 예외 처리
        if (boardRequestDTO.getTitle() == null || boardRequestDTO.getTitle().trim().isEmpty()) {
            throw new BoardException(BoardErrorCode.BOARD_TITLE_EMPTY);
        }
        if (boardRequestDTO.getContent() == null || boardRequestDTO.getContent().trim().isEmpty()) {
            throw new BoardException(BoardErrorCode.BOARD_CONTENT_EMPTY);
        }
        BoardType boardType = boardTypeRepository.findByNameAndParentName(boardRequestDTO.getMajorCategory(), boardRequestDTO.getSubCategory()).orElseThrow(() -> new BoardException(BoardErrorCode.INVALID_BOARD_TYPE));
        String tag = formatTags(boardRequestDTO.getTags());

        // 3. 게시글 저장
        Board board = Board.builder()
                .user(user)
                .title(boardRequestDTO.getTitle())
                .content(boardRequestDTO.getContent())
                .tag(tag)
                .boardType(boardType)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return boardRepository.save(board);
    }

    /** 📌 4. 게시글 삭제 */
    @Transactional
    public void deleteBoard(Long boardId, User user) {

        // 2. 게시글 조회 (없는 경우 예외 발생)
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new BoardException(BoardErrorCode.BOARD_NOT_FOUND));


        // 4. 삭제 요청자가 게시글 작성자가 아닌 경우
        if (!board.getUser().getId().equals(user.getId())) {
            throw new BoardException(BoardErrorCode.BOARD_UPDATE_FORBIDDEN);
        }

        // 5. 삭제 처리 (Soft Delete)
        boardRepository.deleteById(board.getId());
    }

    /** 📌 5. 게시글 수정 */
    @Transactional
    public void updateBoard(Long boardId, BoardUpdateRequestDTO boardUpdateRequestDTO,User user) {

        // 2. 게시글 조회
        Board board = boardRepository.findByIdWithUser(boardId)
                .orElseThrow(() -> new BoardException(BoardErrorCode.BOARD_NOT_FOUND));

        // 3. 수정 요청자가 작성자가 아닌 경우
        if (!board.getUser().getId().equals(user.getId())) {
            throw new BoardException(BoardErrorCode.BOARD_UPDATE_FORBIDDEN);
        }
        // 4. 제목 또는 내용이 비어 있는 경우
        if (boardUpdateRequestDTO.getTitle() == null || boardUpdateRequestDTO.getTitle().trim().isEmpty()) {
            throw new BoardException(BoardErrorCode.BOARD_TITLE_EMPTY);
        }
        if (boardUpdateRequestDTO.getContent() == null || boardUpdateRequestDTO.getContent().trim().isEmpty()) {
            throw new BoardException(BoardErrorCode.BOARD_CONTENT_EMPTY);
        }
        if (boardUpdateRequestDTO.getTags() == null || boardUpdateRequestDTO.getTags().isEmpty()) {
            throw new BoardException(BoardErrorCode.BOARD_TAG_EMPTY);
        }

        String tag = formatTags(boardUpdateRequestDTO.getTags());
        boardRepository.updateBoard(boardId, boardUpdateRequestDTO.getTitle(),boardUpdateRequestDTO.getContent(), tag, LocalDateTime.now());
    }
    @Transactional
    public int countBoardsByBoardTypeName(String boardTypeName) {
        return boardRepository.countBoardsByBoardTypeName(boardTypeName);
    }

    private List<String> splitTags(String tagString) {
        List<String> tags = new ArrayList<>();
        if (tagString != null && !tagString.isEmpty()) {
            String[] allTag = tagString.split(",");
            for (String tag : allTag) {
                tags.add(tag.trim());
            }
        }
        return tags;
    }
    private String formatTags(List<String> tags) {
        return String.join(",", tags);
    }

}
