package ssafy.com.ssacle.global.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class HttpHandshakeInterceptor implements HandshakeInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(HttpHandshakeInterceptor.class);

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpServletRequest = servletRequest.getServletRequest();
            String authToken = httpServletRequest.getHeader("Authorization");

            logger.info("핸드쉐이크 시도: " + httpServletRequest.getRequestURI());
            logger.info("핸드쉐이크 시 Auth Token: " + authToken);

            if (authToken != null && authToken.startsWith("Bearer ")) {
                attributes.put("Authorization", authToken);
                logger.info("Handshake에서 Authorization 토큰 저장: " + authToken);
            } else {
                logger.warn("Authorization 헤더 없음");
            }
        }
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        logger.info("WebSocket Handshake 완료");
    }
}

