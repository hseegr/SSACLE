package ssafy.com.ssacle.board.service;

import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
import ssafy.com.ssacle.user.exception.PickleNotEnoughException;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.user.service.UserService;
import ssafy.com.ssacle.userboard.domain.UserBoard;
import ssafy.com.ssacle.userboard.repository.UserBoardRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static ssafy.com.ssacle.user.exception.UpdateProfileErrorCode.PICKLE_NOT_ENOUGH;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final BoardTypeRepository boardTypeRepository;
    private final UserBoardRepository userBoardRepository;
    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;
    private final EntityManager entityManager;
    /** 📌 1. 모든 게시글 목록 조회 */
    @Transactional
    public List<BoardResponseDTO> getAllBoards() {
        List<BoardResponseDTO> list = new ArrayList<>();
        List<Board> total = boardRepository.findAllWithUser();
        for(Board board : total){
            BoardResponseDTO boardResponseDTO = BoardResponseDTO.builder()
                    .id(board.getId())
                    .title(board.getTitle())
                    .content(board.getContent())
                    .writerInfo(board.getUser().getNickname())
                    .time(board.getCreatedAt())
                    .tags(splitTags(board.getTag()))
                    .majorCategory(board.getBoardType().getParent() != null ? board.getBoardType().getParent().getName() : null)
                    .subCategory(board.getBoardType().getName())
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
                    .id(board.getId())
                    .title(board.getTitle())
                    .content(board.getContent())
                    .writerInfo(board.getUser().getNickname())
                    .time(board.getCreatedAt())
                    .tags(splitTags(board.getTag()))
                    .majorCategory(board.getBoardType().getParent() != null ? board.getBoardType().getParent().getName() : null)
                    .subCategory(board.getBoardType().getName())
                    .build();
            list.add(boardResponseDTO);
        }

        return list;
    }


    @Transactional    /** 📌 2. 게시글 상세 조회 */
    public BoardResponseDTO getBoardById(Long id) {
        Board board = boardRepository.findByIdWithBoardTypeAndParent(id).orElseThrow(() -> new BoardException(BoardErrorCode.BOARD_NOT_FOUND));

        BoardResponseDTO boardResponseDTO = BoardResponseDTO.builder()
                .id(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .writerInfo(board.getUser().getNickname())
                .time(board.getCreatedAt())
                .tags(splitTags(board.getTag()))
                .majorCategory(board.getBoardType().getParent() != null ? board.getBoardType().getParent().getName() : null)
                .subCategory(board.getBoardType().getName())
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

    /** 보드 구입 로직 */
    @Transactional
    public BoardResponseDTO buyBoard(User user, Long boardId) {

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new BoardException(BoardErrorCode.BOARD_NOT_FOUND));

        if (userBoardRepository.existsByUserIdAndBoardId(user.getId(), board.getId())) {
            throw new BoardException(BoardErrorCode.BOARD_ALREADY_PURCHASED);
        }

        if (user.getPickles() < 7) {
            throw new PickleNotEnoughException(PICKLE_NOT_ENOUGH);
        }
        user.setPickles(user.getPickles()-7);
        userRepository.save(user);

        UserBoard userBoard = UserBoard.create(user,board);
        user.getPurchasedBoards().add(userBoard);

        userBoardRepository.save(userBoard);

        return convertToDto(board, true);
    }


    @Transactional
    public Page<BoardResponseDTO> getAllBoards(Long userId, Pageable pageable) {
        Page<Board> boardPage = boardRepository.findAllWithPagination(pageable);

        return boardPage.map(board -> convertToDto(board, userBoardRepository.existsByUserIdAndBoardId(userId, board.getId())));
    }

    /** 📌 2. 특정 게시판 타입의 게시글 목록 조회 (페이지네이션) */
    @Transactional
    public Page<BoardResponseDTO> getBoardsByBoardTypeName(String name, Long userId, Pageable pageable) {
        BoardType boardType = boardTypeRepository.findByName(name)
                .orElseThrow(() -> new BoardException(BoardErrorCode.INVALID_BOARD_TYPE));

        Page<Board> boardPage = boardRepository.findByBoardTypeId(boardType.getId(), pageable);
        return boardPage.map(board -> convertToDto(board, userBoardRepository.existsByUserIdAndBoardId(userId, board.getId())));
    }

    private BoardResponseDTO convertToDto(Board board, boolean isPurchased) {
        String content;

        if ("legend".equals(board.getBoardType().getName())) {
            content = isPurchased ? board.getContent() : "구매 후 열람 가능합니다.";
        } else {
            content = board.getContent();
        }

        return BoardResponseDTO.builder()
                .id(board.getId())
                .title(board.getTitle())
                .content(content)
                .writerInfo(board.getUser().getNickname())
                .time(board.getCreatedAt())
                .tags(splitTags(board.getTag()))
                .majorCategory(board.getBoardType().getParent() != null ? board.getBoardType().getParent().getName() : null)
                .subCategory(board.getBoardType().getName())
                .isPurchased(isPurchased)
                .build();
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
