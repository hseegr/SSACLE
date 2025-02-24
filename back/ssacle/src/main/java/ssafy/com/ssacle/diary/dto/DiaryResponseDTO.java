package ssafy.com.ssacle.diary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class DiaryResponseDTO {
    private Long id;
    private String name;
    private LocalDate date;
}
