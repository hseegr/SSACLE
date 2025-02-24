package ssafy.com.ssacle.lunch.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import ssafy.com.ssacle.comment.domain.Comment;
import ssafy.com.ssacle.vote.domain.Vote;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "lunch")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lunch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime day;

    @Column(name = "menu_name", length = 1024)
    private String menuName;


    @Column(name = "image_url", length = 1024)
    private String imageUrl;

    @OneToMany(mappedBy = "lunch", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Vote> votes;

    public void addVote(Vote vote){
        this.votes.add(vote);
        vote.setLunch(this);
    }
}
