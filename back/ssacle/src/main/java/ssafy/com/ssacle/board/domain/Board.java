package ssafy.com.ssacle.board.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import ssafy.com.ssacle.comment.domain.Comment;
import ssafy.com.ssacle.user.domain.User;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "board")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicUpdate
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boardtype_id", nullable = false)
    private BoardType boardType;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 1024)
    private String content;

    @Column(length = 1024)
    private String tag;

    @Column(name = "image_url", length = 1024)
    private String imageUrl;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Comment> comments;
}
