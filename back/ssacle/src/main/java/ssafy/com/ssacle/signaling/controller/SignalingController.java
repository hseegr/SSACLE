package ssafy.com.ssacle.signaling.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class SignalingController {

    // WebRTC Offer 전송
    @MessageMapping("/app/offer/{sprintId}") // "/app/offer/{sprintId}" 로 메시지 송신
    @SendTo("/sub/offer/{sprintId}")     // 클라이언트는 "/sub/offer/{sprintId}" 를 구독해야 함
    public String handleOffer(@Header("Authorization") String token, @Payload String offer) {
        System.out.println("Received chat message: " + offer);
        System.out.println("Received token: " + token);
        return offer;
    }

    // ICE Candidate 전송
    @MessageMapping("/app/iceCandidate/{sprintId}")
    @SendTo("/sub/iceCandidate/{sprintId}")
    public String handleIceCandidate(@Payload String candidate) {
        return candidate;
    }

    // Answer 전송
    @MessageMapping("/app/answer/{sprintId}")
    @SendTo("/sub/answer/{sprintId}")
    public String handleAnswer(@Payload String answer) {
        return answer;
    }

    // 채팅 메시지 전송
    @MessageMapping("/app/chat/{sprintId}")
    @SendTo("/sub/chat/{sprintId}")
    public String handleChatMessage(@Payload String message) {
        return message;
    }
}
