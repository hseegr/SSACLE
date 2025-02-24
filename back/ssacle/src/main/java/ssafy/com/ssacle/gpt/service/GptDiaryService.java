package ssafy.com.ssacle.gpt.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GptDiaryService {

    private final GptService gptService;

    public String generateDiary(String notionContent) {
        String prompt = """
        You are an AI that summarizes learning notes like Git commit messages.
        Rules:
        - Each line: "1. [Task] - [Method]"
        - Example: "1. Implemented JWT - Used Spring Security"
        - Language: Korean.
        ```%s```
        """.formatted(notionContent);

        return gptService.generateGptText(prompt);
    }

}
