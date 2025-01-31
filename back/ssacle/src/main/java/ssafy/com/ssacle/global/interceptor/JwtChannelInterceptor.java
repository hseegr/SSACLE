package ssafy.com.ssacle.global.interceptor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
public class JwtChannelInterceptor implements ChannelInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(JwtChannelInterceptor.class);

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);

        String authToken = headerAccessor.getFirstNativeHeader("Authorization");
        logger.info("STOMP Connect Header Authorization: " + authToken);

        if (authToken == null || !authToken.startsWith("Bearer ")) {
            logger.warn("Authorization 헤더 없음 또는 잘못된 형식");
        } else {
            // ✅ JWT 토큰 검증 로직 추가 가능
            logger.info("STOMP Connect에서 받은 JWT: " + authToken);
        }

        return message;
    }
}
