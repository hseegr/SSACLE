package ssafy.com.ssacle.category.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import ssafy.com.ssacle.board.domain.BoardType;

import java.util.List;

@Entity
@Table(name = "category")
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;
    /** 부모 주제 (상위 카테고리) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    /** 하위 소주제 목록 (하위 카테고리) */
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Category> children;

    @Column(name = "category_name", nullable = false, length = 255)
    private String categoryName;

    @Column(name = "is_leaf")
    private boolean isLeaf;

    @Column(name = "image", length = 1024)
    private String image;
}
