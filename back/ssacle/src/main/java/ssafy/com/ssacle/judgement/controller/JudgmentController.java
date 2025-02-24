package ssafy.com.ssacle.judgement.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.judgement.dto.JudgmentRequest;
import ssafy.com.ssacle.judgement.dto.JudgmentResponse;
import ssafy.com.ssacle.judgement.service.JudgmentService;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class JudgmentController implements JudgmentSwaggerController {
    private final JudgmentService judgmentService;

    @Override
    public ResponseEntity<JudgmentResponse> applyJudgment(@RequestBody JudgmentRequest request) {
        return ResponseEntity.status(201).body(judgmentService.applyJudgment(request));
    }

    @Override
    public ResponseEntity<JudgmentResponse> getJudgmentBySprint(@PathVariable Long sprintId) {
        return ResponseEntity.ok(judgmentService.getJudgmentBySprint(sprintId));
    }

    @Override
    public ResponseEntity<Void> cancelJudgment(@PathVariable Long sprintId) {
        judgmentService.cancelJudgment(sprintId);
        return ResponseEntity.noContent().build();
    }
}