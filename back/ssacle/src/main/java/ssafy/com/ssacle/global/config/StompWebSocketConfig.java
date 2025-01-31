package ssafy.com.ssacle.global.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;
import ssafy.com.ssacle.global.interceptor.HttpHandshakeInterceptor;
import ssafy.com.ssacle.global.interceptor.JwtChannelInterceptor;

@EnableWebSocketMessageBroker
@Configuration
@RequiredArgsConstructor
public class StompWebSocketConfig implements WebSocketMessageBrokerConfigurer{

    private final JwtChannelInterceptor jwtChannelInterceptor;

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(jwtChannelInterceptor); // ✅ STOMP 메시지 가로채기
    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/connection")
                .addInterceptors(new HttpHandshakeInterceptor())
                .setAllowedOrigins("*");
//                .withSockJS();
//
//        registry.addEndpoint("/connection")
//                .addInterceptors(new HttpHandshakeInterceptor())
//                .setAllowedOrigins("*");
        System.out.println("WebSocket Endpoint 등록 완료: /connection");

    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/sub");
        registry.setApplicationDestinationPrefixes("/app");
        System.out.println("STOMP 메시지 브로커 설정 완료");
    }
}
