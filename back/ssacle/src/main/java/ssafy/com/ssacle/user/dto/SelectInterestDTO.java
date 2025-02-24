package ssafy.com.ssacle.user.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SelectInterestDTO {
    @NotNull
    private List<String> interestCategoryNames; // 사용자가 선택한 관심 카테고리 ID 목록
}
