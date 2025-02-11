package ssafy.com.ssacle.global.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.exception.CannotLoginException;
import ssafy.com.ssacle.user.exception.LoginErrorCode;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.user.service.UserService;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserService userService;

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        String requestURI = request.getRequestURI();
//        if(requestURI.startsWith("/swagger-ui") ||
//                requestURI.startsWith("/v3/api-docs") ||
//                requestURI.startsWith("/swagger-resources") ||
//                requestURI.startsWith("/v3/api-docs.yaml") ||
//                requestURI.startsWith("/swagger-ui.html") ||
//                requestURI.startsWith("/swagger-ui/index.html") ||
//                requestURI.startsWith("/api/v1/join") ||
//                requestURI.startsWith("/api/v1/login") ||
//                requestURI.startsWith("/api/v1/token")){
//            filterChain.doFilter(request,response);
//            return;
//        }
        if(requestURI.startsWith("/swagger-ui") ||
                requestURI.startsWith("/v3/api-docs") ||
                requestURI.startsWith("/swagger-resources") ||
                requestURI.startsWith("/v3/api-docs.yaml") ||
                requestURI.startsWith("/swagger-ui.html") ||
                requestURI.startsWith("/swagger-ui/index.html") ||
                requestURI.startsWith("/api")){
            filterChain.doFilter(request,response);
            return;
        }
        String accessToken = userService.resolveToken(request);

        if (accessToken != null && jwtTokenUtil.isValidToken(accessToken)) {
            authenticateUser(accessToken, request);
            response.setHeader("Authorization", "Bearer " + accessToken);
            //request.setAttribute("Authorization", "Bearer " + accessToken);
        } else {
            String newAccessToken = userService.refreshAccessTokenFromRequest(request, response);
            if (newAccessToken != null) {
                response.setHeader("Authorization", "Bearer " + newAccessToken);
                authenticateUser(newAccessToken, request);
            }
        }

        filterChain.doFilter(request, response);
    }

    private void authenticateUser(String accessToken, HttpServletRequest request) {
        String userEmail = jwtTokenUtil.getUserEmailFromToken(accessToken);
        String role = jwtTokenUtil.getUserRoleFromToken(accessToken);

        String securityRole = role.startsWith("ROLE_") ? role : "ROLE_" + role.toUpperCase(); // "ADMIN" → "ROLE_ADMIN"

        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(userEmail, null, AuthorityUtils.createAuthorityList(securityRole));
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
    }
}

