package ssafy.com.ssacle.ainews.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class AINewsResponseDTO {
    private Long id;
    private String title;
    private String url;
    private LocalDate createdAt;
}
