package ssafy.com.ssacle.team.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
public class TeamDiaryResponse {
    private Long teamId;
    private String teamName;
    private String sprintName;
    private List<String> categoryNames;
    private List<String> diaries;

    public TeamDiaryResponse(Long teamId, String teamName, String sprintName, String categoryName, String diaryContent) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.sprintName = sprintName;
        this.categoryNames = new ArrayList<>();
        if (categoryName != null && !categoryName.isEmpty()) {
            this.categoryNames.add(categoryName);
        }
        this.diaries = new ArrayList<>();
        if (diaryContent != null && !diaryContent.isEmpty()) {
            this.diaries.add(diaryContent);
        }
    }

    public void addDiaryContent(String content) {
        if (!diaries.contains(content)) {
            diaries.add(content);
        }
    }

    public void addCategoryName(String categoryName) {
        if (!categoryNames.contains(categoryName)) {
            categoryNames.add(categoryName);
        }
    }
}
