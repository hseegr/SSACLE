package ssafy.com.ssacle.gpt.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import ssafy.com.ssacle.gpt.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ssafy.com.ssacle.gpt.exception.GptNotRespondError;
import ssafy.com.ssacle.gpt.exception.GptParsingError;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class GptService {

    @Value("${GPT_API_KEY}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String GPT_API_URL = "https://api.openai.com/v1/chat/completions";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GptFullResponse generateTodos(LocalDateTime startAt, LocalDateTime endAt, String topic) {
        int duration = (int) ChronoUnit.DAYS.between(startAt.toLocalDate(), endAt.toLocalDate());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        List<GptMessage> messages = List.of(
                new GptMessage("system", SYSTEM_PROMPT),
                new GptMessage("user", String.format("{\"duration\": %d, \"topic\": \"%s\"}", duration, topic))
        );

        GptRequest gptRequest = new GptRequest("gpt-4", messages);
        HttpEntity<GptRequest> entity = new HttpEntity<>(gptRequest, headers);

        ResponseEntity<GptResponse> response = restTemplate.exchange(
                GPT_API_URL, HttpMethod.POST, entity, GptResponse.class
        );

        if (response.getBody() == null || response.getBody().getChoices().isEmpty()) {
            throw new GptNotRespondError();
        }

        try {
            String jsonString = response.getBody().getChoices().get(0).getMessage().getContent();
            GptFullRawResponse fullResponse = objectMapper.readValue(jsonString, GptFullRawResponse.class);

            LocalDate startDate = startAt.toLocalDate();
            List<TodoResponse> updatedTodos = fullResponse.getTodos().stream()
                    .map(rawTodo -> new TodoResponse(
                            startDate.plusDays(rawTodo.getDay() - 1),
                            rawTodo.getTasks()
                    ))
                    .collect(Collectors.toList());

            return new GptFullResponse(
                    fullResponse.getBasicDescription(),
                    fullResponse.getDetailDescription(),
                    fullResponse.getRecommendedFor(),
                    updatedTodos
            );

        } catch (Exception e) {
            throw new GptParsingError();
        }
    }

    public String generateGptText(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        List<GptMessage> messages = List.of(new GptMessage("user", prompt));

        GptRequest gptRequest = new GptRequest("gpt-4", messages);
        HttpEntity<GptRequest> entity = new HttpEntity<>(gptRequest, headers);

        ResponseEntity<GptResponse> response = restTemplate.exchange(
                GPT_API_URL, HttpMethod.POST, entity, GptResponse.class
        );

        return response.getBody().getChoices().get(0).getMessage().getContent();
    }

    private static final String SYSTEM_PROMPT =
            "You are an AI assistant designed to generate daily learning plans (todo lists) for IT skill development. " +
                    "Based on the user's request, generate a learning plan in JSON format while adhering to the following rules.\n\n" +

                    "1. Both requests and responses must be in JSON format.\n" +
                    "2. The request JSON object must include the following fields:\n" +
                    "   - `duration`: The learning period in days.\n" +
                    "   - `topic`: The learning topic, such as React or Spring.\n\n" +

                    "3. The response JSON object must include:\n" +
                    "   - `basicDescription`: A one-line summary ending with \"course.\"\n" +
                    "   - `detailDescription`: A detailed explanation with at least 100 characters, including core concepts, practical applications, and expected outcomes.\n" +
                    "   - `recommendedFor`: Three sentences describing the target audience, separated by a comma.\n" +
                    "   - `todos`: A structured daily learning plan.\n\n" +

                    "4. All learning plans must be written in Korean.\n" +
                    "5. Each day's learning objectives must include at least 2 and up to 5 items.\n" +
                    "6. Learning objectives must focus on clear concepts rather than vague terms like 'practice' or 'exercise'.\n" +
                    "   - Example: 'Analyze the problem of Props Drilling in React and utilize Context API'.\n" +
                    "7. Include practical exercises only when necessary and provide specific instructions for implementation.\n" +
                    "   - Example: 'Optimize API calls using useEffect and implement data fetching with React Query'.\n" +
                    "8. The learning flow must follow this sequence: background knowledge → core concepts → related concepts → advanced learning → practical application.\n" +
                    "9. Select topics that include concepts commonly misunderstood by beginners and essential elements frequently used in real-world projects.\n" +
                    "10. Avoid covering only syntax. Include problem-solving approaches relevant to real-world development.\n\n" +

                    "Example response format:\n" +
                    "{\n" +
                    "  \"basicDescription\": \"React Beginner Course.\",\n" +
                    "  \"detailDescription\": \"This course covers essential React concepts, including components, state management, event handling, and React Hooks. Through hands-on practice, learners will develop real-world UI building skills.\",\n" +
                    "  \"recommendedFor\": \"People new to React or frontend development, Those who want to build a portfolio through hands-on projects, Developers looking to understand React fundamentals and apply them to real projects.\",\n" +
                    "  \"todos\": [\n" +
                    "    { \n" +
                    "      \"day\": 1, \n" +
                    "      \"tasks\": [\n" +
                    "        \"Understand the basic concepts and necessity of React\",\n" +
                    "        \"Analyze the differences between Virtual DOM and actual DOM in React\",\n" +
                    "        \"Learn JSX syntax and basic usage\",\n" +
                    "        \"Create a simple React component and practice using props\",\n" +
                    "        \"Compare and analyze the roles of props and state\"\n" +
                    "      ] \n" +
                    "    }\n" +
                    "  ]\n" +
                    "}\n\n" +

                    "Ensure that your response strictly follows this format, providing only a JSON response without additional text.";

}
