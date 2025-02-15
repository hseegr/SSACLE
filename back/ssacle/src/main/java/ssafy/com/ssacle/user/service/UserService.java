package ssafy.com.ssacle.user.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.com.ssacle.global.aws.S3ImageUploader;
import ssafy.com.ssacle.global.jwt.JwtFilter;
import ssafy.com.ssacle.global.jwt.JwtTokenUtil;
import ssafy.com.ssacle.sprint.dto.SprintRecommendResponseDTO;
import ssafy.com.ssacle.sprint.dto.SprintSummaryResponse;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.user.domain.RefreshToken;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.dto.*;
import ssafy.com.ssacle.user.exception.CannotLoginException;
import ssafy.com.ssacle.user.exception.CannotUpdateProfileException;
import ssafy.com.ssacle.user.exception.LoginErrorCode;
import ssafy.com.ssacle.user.exception.UpdateProfileErrorCode;
import ssafy.com.ssacle.user.repository.RefreshRepository;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.usercategory.domain.UserCategory;
import ssafy.com.ssacle.usercategory.repository.UserCategoryRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;
    private final RefreshRepository refreshRepository;
    private final UserCategoryRepository userCategoryRepository;
    private final TokenService tokenService;
    private final S3ImageUploader s3ImageUploader;

    @Value("${spring.jwt.accessExpireMs}")
    private long accessExpireMs;

    @Value("${spring.jwt.refreshExpireMs}")
    private long refreshExpireMs;

    public User getAuthenticatedUser() {
        System.out.println(SecurityContextHolder.getContext());
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(userEmail);
        return userRepository.findByEmail(userEmail)
                .orElseThrow(()->new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));
    }
    public User getAuthenticatedUserWithTeams() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findUserWithTeamsByEmail(userEmail)
                .orElseThrow(RuntimeException::new);
    }

    /** ✅ 로그인 및 Access/Refresh Token 생성 */
    @Transactional
    public String authenticateAndGenerateTokens(LoginRequestDTO loginDTO, HttpServletRequest request, HttpServletResponse response) {
        User user = getUserFromToken(loginDTO);
        Optional<RefreshToken> existingToken = refreshRepository.findByUser(user);

        String accessToken = jwtTokenUtil.generateAccessToken(user, accessExpireMs);
        String refreshToken = jwtTokenUtil.generateRefreshToken(user, refreshExpireMs);

        refreshRepository.deleteByUser(user);
        refreshRepository.save(
                RefreshToken.builder()
                        .user(user)
                        .token(refreshToken)
                        .createdAt(LocalDateTime.now())
                        .build()
        );
        tokenService.setRefreshTokenCookie(response, refreshToken); // ✅ TokenService 활용
        response.setHeader("Authorization", "Bearer " + accessToken);
        return "로그인 성공";
    }

    /** ✅ Refresh Token을 사용해 Access Token 갱신 */
    @Transactional
    public String refreshAccessTokenFromRequest(HttpServletRequest request, HttpServletResponse response) {
        Cookie refreshTokenCookie = tokenService.getRefreshTokenCookie(request);
        if (refreshTokenCookie == null) {
            throw new CannotLoginException(LoginErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }
        return tokenService.refreshAccessToken(refreshTokenCookie.getValue(), response);  // ✅ TokenService 활용
    }


    /** ✅ 로그아웃 (Access Token + Refresh Token 무효화) */
    @Transactional
    public void logoutUser(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = resolveToken(request);
        Cookie refreshTokenCookie = tokenService.getRefreshTokenCookie(request);

        // 로그아웃 여부 확인: Refresh Token이 없는 경우 예외 발생
        if (refreshTokenCookie == null || refreshTokenCookie.getValue().isEmpty()) {
            throw new CannotLoginException(LoginErrorCode.ALREADY_LOGGED_OUT);
        }

        // Access Token이 존재하고 유효할 경우에만 사용자 조회
        if (accessToken != null && jwtTokenUtil.isValidToken(accessToken)) {
            String email = jwtTokenUtil.parseClaims(accessToken).getSubject();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));

            // Refresh Token이 DB에 없으면 이미 로그아웃된 상태
            Optional<RefreshToken> existingToken = refreshRepository.findByUser(user);
            if (existingToken.isEmpty()) {
                throw new CannotLoginException(LoginErrorCode.ALREADY_LOGGED_OUT);
            }

            // Refresh Token 삭제 및 무효화
            refreshRepository.deleteByUser(user);
            refreshRepository.flush();
            tokenService.invalidateTokens(response);
        }
    }

    @Transactional
    public ProfileUpdateResponseDTO updateProfile(User user, ProfileUpdateRequestDTO profileUpdateRequestDTO, MultipartFile file){
        if (file != null && !file.isEmpty()) {
            String profileUrl = s3ImageUploader.uploadUser(file);
            user.setProfile(profileUrl);
        }
        if(profileUpdateRequestDTO.getNickname() !=null){
            if(userRepository.existsByNickname(profileUpdateRequestDTO.getNickname())){
                throw new CannotUpdateProfileException(UpdateProfileErrorCode.NICKNAME_ALREADY_EXISTS);
            }
            user.setNickname(profileUpdateRequestDTO.getNickname());
        }
        userRepository.save(user);
        return new ProfileUpdateResponseDTO("사용자 정보 업데이트 성공", user.getId());
    }

    /** ✅ Request에서 Access Token 추출 */
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /** ✅ 사용자 인증 */
    @Transactional
    public User getUserFromToken(LoginRequestDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));

        if (!BCrypt.checkpw(loginDTO.getPassword(), user.getPassword())) {
            throw new CannotLoginException(LoginErrorCode.INVALID_PASSWORD);
        }
        return user;
    }

    @Transactional
    public String findEmailByStudentNumber(FindEmailDTO findEmailDTO) {
        User user = userRepository.findByStudentNumber(findEmailDTO.getStudentNumber())
                .orElseThrow(() -> new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));
        return user.getEmail();
    }

    @Transactional
    public String findPasswordByEmailAndStudentNumber(FindPasswordDTO findPasswordDTO) {
        User user = userRepository.findByEmailAndStudentNumber(findPasswordDTO.getEmail(), findPasswordDTO.getStudentNumber())
                .orElseThrow(() -> new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));
        String tempPassword = generateTempPassword();
        user.updatePassword(tempPassword);
        userRepository.save(user);
        return tempPassword;  // ⚠️ 보안상 비밀번호를 직접 반환하지 않는 것이 좋음
    }

    @Transactional
    public UserResponseDTO getCurrentUser(User user) {
        List<String> categoryIds = userCategoryRepository.findByUserId(user.getId())
                .stream()
                .map(userCategory -> userCategory.getCategory().getCategoryName())
                .toList();
        return UserResponseDTO.of(user, categoryIds);
    }

    @Transactional
    public UpdatePasswordResponseDTO updatePassword(User user, UpdatePasswordRequestDTO updatePasswordRequestDTO){
        if(!BCrypt.checkpw(updatePasswordRequestDTO.getCurrentPassword(), user.getPassword())){
            throw new CannotUpdateProfileException(UpdateProfileErrorCode.INCORRECT_CURRENT_PASSWORD);
        }
        if(!updatePasswordRequestDTO.getNewPassword().equals(updatePasswordRequestDTO.getConfirmPassword())){
            throw new CannotUpdateProfileException(UpdateProfileErrorCode.PASSWORD_CONFIRMATION_MISMATCH);
        }
        user.updatePassword(updatePasswordRequestDTO.getNewPassword());
        userRepository.save(user);
        return new UpdatePasswordResponseDTO("비밀번호 변경 성공", user.getId());
    }
    private String generateTempPassword() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        StringBuilder tempPassword = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < 10; i++) {
            tempPassword.append(characters.charAt(random.nextInt(characters.length())));
        }
        return tempPassword.toString();
    }

}
