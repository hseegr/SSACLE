package ssafy.com.ssacle.ainews.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.ainews.domain.AINews;
import ssafy.com.ssacle.ainews.dto.AINewsRequestDTO;
import ssafy.com.ssacle.ainews.dto.AINewsResponseDTO;
import ssafy.com.ssacle.ainews.repository.AINewsRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AINewsService {
    private final AINewsRepository aiNewsRepository;

    public List<AINewsResponseDTO> getLatestNews() {
        List<AINews> aiNewsList = aiNewsRepository.findAllByOrderByCreatedAtDesc();

        return aiNewsList.stream()
                .map(news -> new AINewsResponseDTO(
                        news.getId(),
                        news.getTitle(),
                        news.getUrl(),
                        news.getCreatedAt().toLocalDate() // LocalDateTime -> LocalDate 변환
                ))
                .collect(Collectors.toList());
    }

    public List<AINewsResponseDTO> getTodayNews() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay(); // 오늘 00:00:00
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX); // 오늘 23:59:59

        List<AINews> aiNewsList = aiNewsRepository.findByCreatedAtBetween(startOfDay, endOfDay);
        return aiNewsList.stream()
                .map(news -> new AINewsResponseDTO(
                        news.getId(),
                        news.getTitle(),
                        news.getUrl(),
                        news.getCreatedAt().toLocalDate() // LocalDateTime -> LocalDate 변환
                ))
                .collect(Collectors.toList());
    }

    public AINewsResponseDTO createNews(AINewsRequestDTO requestDTO) {
        AINews newNews = AINews.builder()
                .title(requestDTO.getTitle())
                .url(requestDTO.getUrl())
                .createdAt(LocalDateTime.now())
                .build();

        AINews savedNews = aiNewsRepository.save(newNews);
        return new AINewsResponseDTO(savedNews.getId(),savedNews.getTitle(), savedNews.getUrl(), savedNews.getCreatedAt().toLocalDate());
    }
}
