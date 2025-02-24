package ssafy.com.ssacle.global.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.exception.CannotLoginException;
import ssafy.com.ssacle.user.exception.LoginErrorCode;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenUtil {
    private final SecretKey SECRET_KEY;

    private final Logger logger = LoggerFactory.getLogger(JwtTokenUtil.class);

    public JwtTokenUtil(@Value("${spring.jwt.secret}") String secretKey){
        this.SECRET_KEY = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user, String type, Long expireTime){
        // 토큰 만료 시간 설정
        Date now = new Date();
        Date expireDate = new Date(now.getTime() + expireTime);
        return Jwts.builder()
                .claim("type", type)
                .claim("email", user.getEmail())
                .claim("nickname", user.getNickname())
                .claim("role","ROLE_" +user.getRole())
                .subject(user.getEmail())
                .issuedAt(now)
                .expiration(expireDate)
                .signWith(SECRET_KEY)
                .compact();

    }

    public String generateAccessToken(User user, @Value("${spring.jwt.accessExpireMs}") Long expireTime){
        return generateToken(user, "access", expireTime);
    }

    public String generateRefreshToken(User user, @Value("${spring.jwt.refreshExpireMs}") Long expireTime) {
        return generateToken(user, "refresh", expireTime);
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY) // 서명 키 설정
                .build()
                .parseSignedClaims(token) // JWT 토큰을 파싱
                .getPayload(); // Claims 객체 반환
    }

    public String getUserEmailFromToken(String token){
        Claims claims = parseClaims(token);
        return claims.get("email", String.class);
    }

    public String getUserNicknameFromToken(String token) {
        Claims claims = parseClaims(token);
        return claims.get("nickname", String.class);
    }

    public String getUserRoleFromToken(String token) {
        Claims claims = parseClaims(token);
        return claims.get("role", String.class);
    }

    public boolean isValidToken(String token){
        Claims claims;
        try{
            claims = parseClaims(token);
            //토큰 만료가 현재 시간 이전이라면 유효한 토큰
            return !claims.getExpiration().before(new Date());
        }catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            logger.info("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            throw new CannotLoginException(LoginErrorCode.REFRESH_TOKEN_EXPIRED);
        } catch (IllegalArgumentException e) {
            logger.info("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }
}