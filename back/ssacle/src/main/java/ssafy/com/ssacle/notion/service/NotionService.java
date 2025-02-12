package ssafy.com.ssacle.notion.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotionService {

    @Value("${NOTION_API_KEY}")
    private String NOTION_API_KEY;

    @Value("${DATABASE_ID}")
    private String DATABASE_ID;

    @Value("${NOTION_API_URL}")
    private String NOTION_API_URL;
    public String createNotionPageForTeam(String sprintName, Long teamId) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + NOTION_API_KEY);
        headers.set("Content-Type", "application/json");
        headers.set("Notion-Version", "2022-06-28");

        String notionTitle = sprintName + "_" + teamId;  // 스프린트명_팀ID 형식

        Map<String, Object> properties = new HashMap<>();
        properties.put("이름", Map.of("title", List.of(Map.of("text", Map.of("content", notionTitle)))));

        Map<String, Object> requestBody = Map.of(
                "parent", Map.of("database_id", DATABASE_ID),
                "properties", properties
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(NOTION_API_URL, HttpMethod.POST, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody().get("url").toString();  // 생성된 Notion 페이지 URL 반환
        } else {
            throw new RuntimeException("노션 페이지 생성 실패: " + response.getBody());
        }
    }
}
