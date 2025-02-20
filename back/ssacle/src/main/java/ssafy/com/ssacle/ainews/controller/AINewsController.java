package ssafy.com.ssacle.ainews.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.ainews.dto.AINewsRequestDTO;
import ssafy.com.ssacle.ainews.dto.AINewsResponseDTO;
import ssafy.com.ssacle.ainews.service.AINewsService;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class AINewsController implements AINewsSwaggerController{
    private final AINewsService aiNewsService;

    @Override
    public ResponseEntity<List<AINewsResponseDTO>> getLatestNews() {
        return ResponseEntity.ok().body(aiNewsService.getLatestNews());
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AINewsResponseDTO> createNews(AINewsRequestDTO requestDTO) {
        return ResponseEntity.ok().body(aiNewsService.createNews(requestDTO));
    }

    @GetMapping("/today")
    public ResponseEntity<List<AINewsResponseDTO>> getTodayNews() {
        List<AINewsResponseDTO> todayNews = aiNewsService.getTodayNews();
        return ResponseEntity.ok(todayNews);
    }

}
