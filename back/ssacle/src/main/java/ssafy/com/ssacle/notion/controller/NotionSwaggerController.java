package ssafy.com.ssacle.notion.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import ssafy.com.ssacle.notion.dto.NotionRequestDto;

@Tag(name = "Notion API", description = "Notion 데이터 생성 및 관리 API입니다.")
public interface NotionSwaggerController {

    @Operation(summary = "Notion 카테고리 생성", description = "대, 중, 소 카테고리 및 팀 페이지를 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "카테고리 생성 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터", content = @Content),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생", content = @Content)
    })
    @PostMapping("/create")
    ResponseEntity<String> createCategory(@RequestBody NotionRequestDto requestDto);
}
