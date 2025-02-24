package ssafy.com.ssacle.category.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import ssafy.com.ssacle.SprintCategory.domain.SprintCategory;
import ssafy.com.ssacle.board.domain.BoardType;
import ssafy.com.ssacle.sprint.domain.Sprint;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "category")
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 부모 주제 (상위 카테고리) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonIgnore
    private Category parent;

    /** 하위 소주제 목록 (하위 카테고리) */
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Category> children;

    @Builder.Default
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SprintCategory> sprintCategories = new ArrayList<>();

    @Column(name = "category_name", nullable = false, length = 255)
    private String categoryName;

    @Column(name = "level", nullable = false)
    private Integer level; // 1. 상, 2. 중, 3. 하

    @Column(name = "image", nullable = true, length = 1024)
    private String image;

    public String getMajorCategoryName() {
        Category current = this;
        while (current.getParent() != null) {
            current = current.getParent();
        }
        return current.getCategoryName();
    }

    /** ✅ 중간(sub) 카테고리 찾기 */
    public String getSubCategoryName() {
        if (this.parent == null) {
            return null; // 부모가 없으면 중간 카테고리 없음
        }

        Category parent = this.parent;
        while (parent.getParent() != null && parent.getParent().getParent() != null) {
            parent = parent.getParent();
        }
        return parent.getCategoryName();
    }

    public List<Category> getSubCategories() {
        return this.children;
    }

    public String getLowestCategoryName() {
        Category current = this;
        while (!current.getChildren().isEmpty()) {
            current = current.getChildren().get(0); // 가장 첫 번째 하위 카테고리 선택
        }
        return current.getCategoryName();
    }
}
