package ssafy.com.ssacle.user.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.global.jwt.JwtTokenUtil;
import ssafy.com.ssacle.user.domain.RefreshToken;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.exception.CannotLoginException;
import ssafy.com.ssacle.user.exception.LoginErrorCode;
import ssafy.com.ssacle.user.repository.RefreshRepository;
import ssafy.com.ssacle.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final JwtTokenUtil jwtTokenUtil;
    private final RefreshRepository refreshRepository;
    private final UserRepository userRepository;

    @Value("${spring.jwt.accessExpireMs}")
    private long accessExpireMs;

    @Value("${spring.jwt.refreshExpireMs}")
    private long refreshExpireMs;

    @Transactional
    public String refreshAccessToken(String refreshToken, HttpServletResponse response) {
        if (refreshToken == null || !jwtTokenUtil.isValidToken(refreshToken)) {
            throw new CannotLoginException(LoginErrorCode.INVALID_REFRESH_TOKEN);
        }

        String email = jwtTokenUtil.parseClaims(refreshToken).getSubject();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));
        RefreshToken storedToken = refreshRepository.findByUser(user).orElseThrow(()-> new CannotLoginException(LoginErrorCode.INVALID_REFRESH_TOKEN));
        if (!storedToken.getToken().equals(refreshToken)) {
            throw new CannotLoginException(LoginErrorCode.INVALID_REFRESH_TOKEN);
        }

        // 새로운 Access Token & Refresh Token 발급
        String newAccessToken = jwtTokenUtil.generateAccessToken(user, accessExpireMs);
        String newRefreshToken = jwtTokenUtil.generateRefreshToken(user, refreshExpireMs);

        // 기존 Refresh Token 폐기 (추후 Redis 또는 DB 연동 가능)
        refreshRepository.deleteByUser(user);  // 기존 Token 삭제
        invalidateTokens(response);  // 기존 Token 쿠키에서도 제거

        // ✅ 새로운 Refresh Token 저장
        refreshRepository.save(
                RefreshToken.builder()
                        .user(user)
                        .token(newRefreshToken)
                        .createdAt(LocalDateTime.now())
                        .build()
        );
        // 새로운 Refresh Token 쿠키 저장
        setRefreshTokenCookie(response, newRefreshToken);
        response.setHeader("Authorization", "Bearer " + newAccessToken);

        return "Access & Refresh token reissued successfully";
    }

    public void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge((int) refreshExpireMs);
        response.addCookie(refreshCookie);
    }

    public void invalidateTokens(HttpServletResponse response) {
        Cookie refreshCookie = new Cookie("refreshToken", "");
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(-1);
        response.addCookie(refreshCookie);
    }

    /** ✅ Request에서 Refresh Token 쿠키 가져오기 */
    public Cookie getRefreshTokenCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie;
                }
            }
        }
        return null;
    }
}
