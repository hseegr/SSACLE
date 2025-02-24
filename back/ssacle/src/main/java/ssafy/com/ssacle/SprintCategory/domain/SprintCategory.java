package ssafy.com.ssacle.SprintCategory.domain;

import jakarta.persistence.*;
import lombok.*;
import ssafy.com.ssacle.category.domain.Category;
import ssafy.com.ssacle.sprint.domain.Sprint;

@Entity
@Table(name = "sprint_category")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class SprintCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id")
    private Sprint sprint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    public SprintCategory(Sprint sprint, Category category) {
        this.sprint = sprint;
        this.category = category;
    }
}

