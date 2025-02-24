package ssafy.com.ssacle.notion.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class NotionContentService {

    private final NotionClient notionClient;
    private final RestTemplate restTemplate = new RestTemplate();

    public String getNotionPageContent(String notionUrl) {
        String notionPageId = extractPageIdFromUrl(notionUrl);
        String url = "https://api.notion.com/v1/blocks/" + notionPageId + "/children";

        return notionClient.getPageContent(url);
    }

    private String extractPageIdFromUrl(String notionUrl) {
        return notionUrl.substring(notionUrl.lastIndexOf("/") + 1).replaceAll("-", "");
    }
}
