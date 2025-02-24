package ssafy.com.ssacle.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.user.dto.*;
import ssafy.com.ssacle.user.service.JoinService;
import ssafy.com.ssacle.user.service.VerificationCodeService;

@RestController
@RequestMapping("/api/v1/join")
@RequiredArgsConstructor
public class JoinController implements JoinSwaggerController{
    private final JoinService joinService;
    private final VerificationCodeService verificationCodeService;

    @Override
    public ResponseEntity<String> sendVerificationCode(VerificationRequestDTO request) {
        joinService.sendVerificationCode(request.getEmail(), request.getWebhook());
        return ResponseEntity.ok("Verification code sent.");
    }

    @Override
    public ResponseEntity<String> verifyCode(VerificationCodeDTO request) {
        boolean isValid = verificationCodeService.verifyCode(request.getEmail(), request.getVerificationCode());
        if (isValid) {
            return ResponseEntity.ok("Verification code confirmed.");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid verification code.");
    }

    @Override
    public ResponseEntity<JoinResponseDTO> createUser(JoinRequestDTO joinDTO) {
        JoinResponseDTO response = joinService.join(joinDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    public ResponseEntity<Boolean> checkStudentNumberDuplicate(CheckStudentNumberDTO checkStudentNumberDTO) {
        return ResponseEntity.ok().body(joinService.isStudentNumberDuplicate(checkStudentNumberDTO.getStudentNumber()));
    }

    @Override
    public ResponseEntity<Boolean> checkEmailDuplicate(CheckEmailDTO checkEmailDTO) {
        return ResponseEntity.ok().body(joinService.isEmailDuplicate(checkEmailDTO.getEmail()));
    }

    @Override
    public ResponseEntity<Boolean> checkPassword(CheckPasswordDTO checkPasswordDTO) {
        return ResponseEntity.ok().body(joinService.checkPassword(checkPasswordDTO.getPassword(),checkPasswordDTO.getConfirmpassword()));
    }

    @Override
    public ResponseEntity<Boolean> checkNicknameDuplicate(CheckNickNameDTO checkNickNameDTO) {
        return ResponseEntity.ok().body(joinService.isNicknameDuplicate(checkNickNameDTO.getNickname()));
    }

    @Override
    public ResponseEntity<Void> selectInterestCategories(@PathVariable Long userId, @RequestBody SelectInterestDTO selectInterestDTO) {
        joinService.selectInterestCategories(userId, selectInterestDTO);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
