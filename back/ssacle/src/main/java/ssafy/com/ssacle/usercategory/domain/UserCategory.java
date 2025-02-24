package ssafy.com.ssacle.usercategory.domain;

import jakarta.persistence.*;
import lombok.*;
import ssafy.com.ssacle.category.domain.Category;
import ssafy.com.ssacle.user.domain.User;

@Entity
@Table(name = "user_category")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserCategory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    public UserCategory(User user, Category category){
        this.user=user;
        this.category=category;
    }

}
