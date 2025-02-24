package ssafy.com.ssacle.user.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class VerificationCodeService {
    private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();
    private final Map<String, Boolean> verifiedEmails = new ConcurrentHashMap<>();
    private final Map<String, Long> expirationTimes = new ConcurrentHashMap<>();

    private static final long EXPIRATION_TIME = 10 * 60 * 1000; // 인증 코드 유효 시간 : 10분

    // 인증 코드 생성 및 저장
    public String generateVerificationCode(String email) {
        String code = String.valueOf(new Random().nextInt(900000) + 100000); // 6자리 랜덤 코드
        verificationCodes.put(email, code);
        expirationTimes.put(email, System.currentTimeMillis() + EXPIRATION_TIME);
        return code;
    }

    // 인증 코드 검증
    public boolean verifyCode(String email, String code) {
        if (!verificationCodes.containsKey(email) || !verificationCodes.get(email).equals(code)) return false;
        if (System.currentTimeMillis() > expirationTimes.get(email)) return false; // 만료 시간 확인
        verifiedEmails.put(email,true);
        verificationCodes.remove(email);
        expirationTimes.remove(email);
        return true;
    }

    public boolean isEmailVerified(String email) {
        return verifiedEmails.getOrDefault(email, false);
    }
}
