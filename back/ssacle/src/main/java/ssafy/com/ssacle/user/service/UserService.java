package ssafy.com.ssacle.user.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.global.jwt.JwtFilter;
import ssafy.com.ssacle.global.jwt.JwtTokenUtil;
import ssafy.com.ssacle.user.domain.RefreshToken;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.dto.FindEmailDTO;
import ssafy.com.ssacle.user.dto.FindPasswordDTO;
import ssafy.com.ssacle.user.dto.LoginRequestDTO;
import ssafy.com.ssacle.user.exception.CannotLoginException;
import ssafy.com.ssacle.user.exception.LoginErrorCode;
import ssafy.com.ssacle.user.repository.RefreshRepository;
import ssafy.com.ssacle.user.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;
    private final RefreshRepository refreshRepository;
    private final TokenService tokenService;

    @Value("${spring.jwt.accessExpireMs}")
    private long accessExpireMs;

    @Value("${spring.jwt.refreshExpireMs}")
    private long refreshExpireMs;

    public User getAuthenticatedUser() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByEmail(userEmail)
                .orElseThrow(()->new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));
    }
    public User getAuthenticatedUserWithTeams() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("==================");
        System.out.println(userEmail);
        System.out.println("==================");
        return userRepository.findUserWithTeamsByEmail(userEmail)
                .orElseThrow(RuntimeException::new);
    }

    /** ✅ 로그인 및 Access/Refresh Token 생성 */
    @Transactional
    public String authenticateAndGenerateTokens(LoginRequestDTO loginDTO, HttpServletRequest request, HttpServletResponse response) {
        User user = getUserFromToken(loginDTO);
        Optional<RefreshToken> existingToken = refreshRepository.findByUser(user);
        if (existingToken.isPresent()) {
            throw new CannotLoginException(LoginErrorCode.ALREADY_LOGGED_IN);
        }
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
            ResponseCookie expiredCookie = ResponseCookie.from("refreshToken", "")
                    .path("/") // 기존과 동일한 path 설정
                    .httpOnly(true)
                    .secure(false) // 개발 환경에서는 false, 배포 환경에서는 true
                    .sameSite("None") // CSRF 방지 및 cross-site 요청 허용
                    .maxAge(0) // 쿠키 만료 즉시 삭제
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, expiredCookie.toString());
            tokenService.invalidateTokens(response);
        }
    }

    /** ✅ Request에서 Access Token 추출 */
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("access-token");
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
        return user.getPassword();  // ⚠️ 보안상 비밀번호를 직접 반환하지 않는 것이 좋음
    }

}
