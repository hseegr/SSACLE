package ssafy.com.ssacle.notion.dto;

import lombok.Data;

@Data
public class NotionRequestDto {
    private String category1; // '대' 카테고리
    private String category2; // '중' 카테고리
    private String category3; // '소' 카테고리
    private String teamName;  // 팀 이름
}

