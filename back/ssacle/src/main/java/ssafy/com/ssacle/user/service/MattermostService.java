package ssafy.com.ssacle.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MattermostService {
//    @Value("${mattermost.webhook.url}")
//    private String webhookUrl;

    public void sendVerificationCode(String email, String webhook, String code) {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> payload = new HashMap<>();
        payload.put("text", "🔑 **Email Verification Code** 🔑\n📧 Email: " + email + "\n🔢 Verification Code: `" + code + "`\n\nThis code will expire in 10 minutes.");

        restTemplate.postForEntity(webhook, payload, String.class);
    }
}
