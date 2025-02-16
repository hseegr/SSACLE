package ssafy.com.ssacle.ssaldcupcategory.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.com.ssacle.category.domain.Category;

import ssafy.com.ssacle.ssaldcup.domain.SsaldCup;

@Entity
@Table(name = "ssaldcup_category")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class SsaldCupCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ssaldcup_id")
    private SsaldCup ssaldCup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    public SsaldCupCategory(SsaldCup ssaldCup, Category category){
        this.ssaldCup=ssaldCup;
        this.category=category;
    }
}
