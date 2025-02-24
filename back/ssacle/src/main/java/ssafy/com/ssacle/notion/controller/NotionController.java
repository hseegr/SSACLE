package ssafy.com.ssacle.notion.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.com.ssacle.notion.dto.NotionRequestDto;
import ssafy.com.ssacle.notion.service.NotionService;

@RestController
@RequestMapping("/notion")
@RequiredArgsConstructor
public class NotionController implements NotionSwaggerController {

    private final NotionService notionService;

    @Override
    public ResponseEntity<String> createCategory(NotionRequestDto requestDto) {
        notionService.createCategoryStructure(
                requestDto.getCategory1(), requestDto.getCategory2(),
                requestDto.getCategory3(), requestDto.getTeamName()
        );
        return ResponseEntity.ok("Created Successfully!");
    }
}
