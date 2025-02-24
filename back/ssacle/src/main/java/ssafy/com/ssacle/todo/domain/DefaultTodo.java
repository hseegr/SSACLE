package ssafy.com.ssacle.todo.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import ssafy.com.ssacle.sprint.domain.Sprint;

import java.time.LocalDate;

@Entity
@Table(name = "default_todo")
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class DefaultTodo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sprint_id")
    @JsonIgnore
    @Setter
    private Sprint sprint;

    @Column(name="content", nullable = false, length = 1024)
    private String content;

    @Column(name = "date", nullable = false)
    private LocalDate date;

}
