package ssafy.com.ssacle.diary.dto;

import lombok.Getter;
import ssafy.com.ssacle.diary.domain.Diary;

import java.time.LocalDate;

@Getter
public class DiaryDetailResponse {
    private final Long id;
    private final String name;
    private final String content;
    private final LocalDate date;

    public DiaryDetailResponse(Diary diary) {
        this.id = diary.getId();
        this.name = diary.getTitle();
        this.content = diary.getContent();
        this.date = diary.getDate();
    }

    public static DiaryDetailResponse from(Diary diary) {
        return new DiaryDetailResponse(diary);
    }
}
