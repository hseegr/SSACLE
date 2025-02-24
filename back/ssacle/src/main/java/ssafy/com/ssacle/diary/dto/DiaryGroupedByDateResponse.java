package ssafy.com.ssacle.diary.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
public class DiaryGroupedByDateResponse {
    private final LocalDate date;
    private final List<DiaryContent> contents;

    @Builder
    public DiaryGroupedByDateResponse(LocalDate date, List<DiaryContent> contents) {
        this.date = date;
        this.contents = contents;
    }

    @Getter
    public static class DiaryContent {
        private final Long id;
        private final String name;

        @Builder
        public DiaryContent(Long id, String name) {
            this.name = name;
            this.id = id;
        }

        public static DiaryContent from(DiaryResponseDTO response) {
            return DiaryContent.builder()
                    .id(response.getId())
                    .name(response.getName())
                    .build();
        }
    }

    // DiaryResponseDTO 리스트를 날짜별로 변환하는 정적 메서드
    public static List<DiaryGroupedByDateResponse> fromList(List<DiaryResponseDTO> responses) {
        Map<LocalDate, List<DiaryContent>> groupedByDate = responses.stream()
                .collect(Collectors.groupingBy(
                        DiaryResponseDTO::getDate,
                        Collectors.mapping(DiaryContent::from, Collectors.toList())
                ));

        return groupedByDate.entrySet().stream()
                .map(entry -> DiaryGroupedByDateResponse.builder()
                        .date(entry.getKey())
                        .contents(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }
}
