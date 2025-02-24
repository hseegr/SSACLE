package ssafy.com.ssacle.board.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "board_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 부모 주제 (상위 카테고리) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private BoardType parent;

    /** 하위 소주제 목록 (하위 카테고리) */
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<BoardType> children;

    @Column(nullable = false, length = 512)
    private String name;

    private boolean isLeaf;
}
