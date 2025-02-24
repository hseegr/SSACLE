package ssafy.com.ssacle.ainews.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import ssafy.com.ssacle.ainews.dto.AINewsRequestDTO;
import ssafy.com.ssacle.ainews.dto.AINewsResponseDTO;

import java.util.List;

@Tag(name = "AINews API", description = "AINews 관련 API입니다.")
public interface AINewsSwaggerController {
    @GetMapping("/aiNews")
    @Operation(summary = "최신 AI 뉴스 조회", description = "AI 뉴스를 최신순으로 조회합니다.")
    ResponseEntity<List<AINewsResponseDTO>> getLatestNews();

    @PostMapping("/admin/registerAINews")
    @Operation(summary = "새 AI 뉴스 등록", description = "관리자가 새로운 AI 뉴스를 등록합니다.")
    ResponseEntity<AINewsResponseDTO> createNews(@RequestBody AINewsRequestDTO requestDTO);
}
