package ssafy.com.ssacle.notion.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NotionClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${notion.api-key}")
    private String notionApiKey;

    private static final String NOTION_API_BASE_URL = "https://api.notion.com/v1";

    /** Notion API의 `/search` 엔드포인트를 호출하여 특정 페이지의 존재 여부 확인 */
    public String searchPage(String queryJson) {
        HttpHeaders headers = getHeaders();
        HttpEntity<String> requestEntity = new HttpEntity<>(queryJson, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                NOTION_API_BASE_URL + "/search",
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        return response.getBody();
    }

    /** Notion API의 `/pages` 엔드포인트를 호출하여 새로운 페이지/보드를 생성 */
    public String createPage(String jsonBody) {
        HttpHeaders headers = getHeaders();
        HttpEntity<String> requestEntity = new HttpEntity<>(jsonBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                NOTION_API_BASE_URL + "/pages",
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        return response.getBody();
    }

    /** 노션 페이지 가져오기 */
    public String getPageContent(String url) {
        HttpHeaders headers = getHeaders();
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, requestEntity, String.class
        );

        return response.getBody();
    }

    /** Notion API 호출에 필요한 요청 헤더 생성 */
    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + notionApiKey);
        headers.set("Notion-Version", "2022-06-28");
        return headers;
    }
}
