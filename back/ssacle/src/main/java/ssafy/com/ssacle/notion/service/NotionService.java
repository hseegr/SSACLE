package ssafy.com.ssacle.notion.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.notion.exception.NotionCreatePageException;
import ssafy.com.ssacle.todo.dto.DefaultTodoResponse;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotionService {

    @Value("${NOTION_MAIN_PAGE_ID}")
    private String SSACLE_MAIN_PAGE_ID;

    private final NotionClient notionClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /** SSACLE 메인 페이지에서 계층적으로 데이터베이스 & 페이지를 탐색하고 생성*/
    public String createCategoryStructure(String category1, String category2, String category3, String teamName) {
        // '대' 카테고리 데이터베이스 탐색 및 생성
//        System.out.println("========대 카테고리 ============");
        String galleryId = findOrCreatePage(SSACLE_MAIN_PAGE_ID, category1);
//        System.out.println("✅ 대 카테고리 ID: " + galleryId);

        // '중' 카테고리 페이지 탐색 및 생성
//        System.out.println("========중 카테고리 ============");
        String middlePageId = findOrCreatePage(galleryId, category2);
//        System.out.println("✅ 중 카테고리 ID: " + middlePageId);

        // '소' 카테고리 데이터베이스 탐색 및 생성
//        System.out.println("========소 카테고리 ============");
        String smallDatabaseId = findOrCreatePage(middlePageId, category3);
//        System.out.println("✅ 소 카테고리 ID: " + smallDatabaseId);

        // 최종 팀 페이지 생성
        return createTeamPage(smallDatabaseId, teamName);
    }

    /** 페이지 내부에서 특정 이름의 페이지가 존재하는지 확인하고 없으면 생성 */
    private String findOrCreatePage(String databaseId, String pageName) {
        // 데이터베이스 내부에서 해당 페이지 검색
        String searchResponse = findPage(pageName);
        String existingPageId = extractPageId(searchResponse, pageName);

        if (existingPageId != null) {
//            System.out.println("페이지 존재.");
            return existingPageId;
        }

        // 페이지가 없으면 새로 생성
        return createPage(databaseId, pageName);
    }

    /** Notion에서 특정 이름의 페이지 검색 */
    private String findPage(String category) {
        String queryJson = """
        {
            "query": "%s",
            "sort": { "direction": "ascending", "timestamp": "last_edited_time" }
        }
        """.formatted(category);

        return notionClient.searchPage(queryJson);
    }

    /** 새 페이지 생성 */
    private String createPage(String databaseId, String pageName) {
//        System.out.println("📌 새 페이지 생성: " + pageName);
        String requestBody = """
        {
            "parent": { "page_id": "%s" },
            "properties": {
                "title": { "title": [{ "text": { "content": "%s" } }] }
            }
        }
        """.formatted(databaseId, pageName);

        return extractPageIdFromResponse(notionClient.createPage(requestBody));
    }

    /** '소' 카테고리 내부에 팀 페이지 생성 */
    private String createTeamPage(String databaseId, String teamName) {
//        System.out.println("📌 팀 페이지 생성: " + teamName);
        String requestBody = """
        {
            "parent": { "page_id": "%s" },
            "properties": {
                "title": { "title": [{ "text": { "content": "%s" } }] }
            }
        }
        """.formatted(databaseId, teamName);

        String responseJson = notionClient.createPage(requestBody);
        String teamId = extractPageIdFromResponse(responseJson);
        if (teamId == null) throw new NotionCreatePageException();

        String teamUrl = getNotionPageUrl(teamId);
//        System.out.println("✅ 팀 페이지 ID: " + teamId);
//        System.out.println("🔗 팀 페이지 URL: " + teamUrl);
        return teamUrl;
    }

    /** 날짜별 페이지 생성 (팀 페이지 내) */
    public void createDailyPages(String teamPageId, List<DefaultTodoResponse> defaultTodoResponses) {
//        System.out.println("--------- 팀별 날짜 페이지 생성 메서드 ---------------");
        if (teamPageId.startsWith("https://www.notion.so/")) {
            teamPageId = extractPageIdFromUrl(teamPageId); // URL에서 UUID만 추출
        }

        for (DefaultTodoResponse todoResponse : defaultTodoResponses) {
            String dateName = todoResponse.getDate().toString();
//            System.out.println("날짜별 페이지 생성: " + dateName);

            String requestBody = """
            {
                "parent": { "page_id": "%s" },
                "properties": {
                    "title": { "title": [{ "text": { "content": "%s" } }] }
                }
            }
            """.formatted(teamPageId, dateName);

            notionClient.createPage(requestBody);
        }
    }

    /** Notion 검색 응답에서 주어진 이름과 일치하는 Page ID 추출 */
    private String extractPageId(String jsonResponse, String expectedName) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode resultsNode = rootNode.get("results");

            if (resultsNode != null && resultsNode.isArray()) {
                for (JsonNode node : resultsNode) {
                    if ("page".equals(node.get("object").asText())) {
                        JsonNode propertiesNode = node.get("properties");

                        if (propertiesNode != null && propertiesNode.has("title")) {
                            JsonNode titleNode = propertiesNode.get("title").get("title");

                            if (titleNode != null && titleNode.isArray()) {
                                for (JsonNode titleElement : titleNode) {
                                    if (titleElement.has("text") && titleElement.get("text").has("content")) {
                                        String pageTitle = titleElement.get("text").get("content").asText();
                                        if (expectedName.equals(pageTitle)) {
                                            return node.get("id").asText();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /** 페이지 ID에서 URL 변환 */
    private String getNotionPageUrl(String teamId) {
        return "https://www.notion.so/" + teamId.replace("-", "");
    }

    /** Notion API 응답에서 페이지 ID 추출 */
    private String extractPageIdFromResponse(String responseJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseJson);
            return rootNode.get("id").asText();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /** Notion URL에서 페이지 ID 추출 */
    private String extractPageIdFromUrl(String notionUrl) {
        return notionUrl.substring(notionUrl.lastIndexOf("/") + 1, notionUrl.length()).replaceAll("-", "");
    }


    /** 오늘 날짜의 노션 페이지 가져오기 */
    public String getTodayDiaryContent(String teamNotionUrl) {
        String teamPageId = extractPageIdFromUrl(teamNotionUrl);
//        System.out.println("팀 page id : " + teamPageId);
        String todayDate = LocalDate.now().toString();

        // 🔹 오늘 날짜에 해당하는 페이지 ID 조회
        String todayPageId = getDatePageId(teamPageId, todayDate);
        if (todayPageId == null) {
//            System.out.println("오늘 날짜의 페이지가 없음: " + todayDate);
            return null;
        }

        // 🔹 해당 날짜 페이지의 콘텐츠 가져오기
        return getNotionPageContent(todayPageId);
    }

    /** 팀 페이지에서 "오늘 날짜"에 해당하는 하위 페이지 ID 찾기 */
    private String getDatePageId(String teamPageId, String todayDate) {
        String url = "https://api.notion.com/v1/blocks/" + teamPageId + "/children";
        String responseJson = notionClient.getPageContent(url);

        try {
            JsonNode rootNode = objectMapper.readTree(responseJson);
            JsonNode resultsNode = rootNode.get("results");

            if (resultsNode != null && resultsNode.isArray()) {
                for (JsonNode node : resultsNode) {
                    if ("block".equals(node.get("object").asText()) && "child_page".equals(node.get("type").asText())) {
                        JsonNode childPageNode = node.get("child_page");
                        if (childPageNode != null && childPageNode.has("title")) {
                            String pageTitle = childPageNode.get("title").asText();
//                            System.out.println("🔍 찾은 페이지 제목: " + pageTitle);

                            if (todayDate.equals(pageTitle)) {
                                return node.get("id").asText(); // 오늘 날짜의 페이지 ID 반환
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    /** 특정 날짜 페이지의 콘텐츠 가져오기 */
    public String getNotionPageContent(String notionPageId) {
        String url = "https://api.notion.com/v1/blocks/" + notionPageId + "/children";
        String responseJson = notionClient.getPageContent(url);
        return extractTextFromNotionBlocks(responseJson);
    }

    /** Notion API 응답에서 블록 내용을 추출 */
    private String extractTextFromNotionBlocks(String jsonResponse) {
        try {
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode resultsNode = rootNode.get("results");

            List<String> textContents = new ArrayList<>();
            if (resultsNode != null && resultsNode.isArray()) {
                for (JsonNode blockNode : resultsNode) {
                    String blockType = blockNode.get("type").asText();
                    JsonNode contentNode = blockNode.get(blockType);
                    if (contentNode != null && contentNode.has("rich_text")) {
                        JsonNode richTextArray = contentNode.get("rich_text");
                        for (JsonNode textElement : richTextArray) {
                            if (textElement.has("text") && textElement.get("text").has("content")) {
                                textContents.add(textElement.get("text").get("content").asText());
                            }
                        }
                    }
                }
            }
            return String.join("\n", textContents);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
