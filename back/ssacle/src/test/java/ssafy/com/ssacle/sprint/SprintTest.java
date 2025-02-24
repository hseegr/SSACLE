package ssafy.com.ssacle.sprint;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.sprint.domain.SprintBuilder;
import ssafy.com.ssacle.sprint.exception.SprintRequiredException;
import ssafy.com.ssacle.team.domain.SprintTeamBuilder;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.exception.UserRequiredException;
import ssafy.com.ssacle.user.domain.User;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class SprintTest {

    @Test
    @DisplayName("SprintBuilder를 사용하여 Sprint 생성")
    void createSprintWithBuilder() {
        // Given
        Sprint sprint = SprintBuilder.builder()
                .name("Java Sprint")
                .basicDescription("Java 학습을 위한 스프린트")
                .detailDescription("Spring Boot 학습 과정")
                .recommendedFor("for me")
                .startAt(LocalDateTime.now())
                .endAt(LocalDateTime.now().plusDays(7))
                .announceAt(LocalDateTime.now().plusDays(8))
                .maxMembers(10)
                .build();

        // When & Then
        assertNotNull(sprint);
        assertEquals("Java Sprint", sprint.getName());
        assertEquals(10, sprint.getMaxMembers());
    }

    @Test
    @DisplayName("SprintTeamBuilder를 사용하여 Team 생성")
    void createTeamWithBuilder() {
        // Given
        Sprint sprint = SprintBuilder.builder()
                .name("Backend Sprint")
                .basicDescription("백엔드 기술 학습")
                .detailDescription("JPA와 Spring Security 집중 학습")
                .recommendedFor("for me")
                .startAt(LocalDateTime.now())
                .endAt(LocalDateTime.now().plusDays(10))
                .announceAt(LocalDateTime.now().plusDays(11))
                .maxMembers(5)
                .build();

        User user = User.createStudent("test@example.com", "password", "John Doe", "1234567", "johndoe");

        // When
        Team team = SprintTeamBuilder.builder()
                .addUser(user)
                .participateSprint(sprint)
                .build();

        // Then
        assertNotNull(team);
        assertEquals(1, team.getCurrentMembers());
        assertEquals(user.getName(), team.getName());
        assertTrue(sprint.getTeams().contains(team));
    }

    @Test
    @DisplayName("Sprint 없이 팀을 생성할 경우 예외 발생")
    void createTeamWithoutSprintThrowsException() {
        // Given
        User user = User.createStudent("test@example.com", "password", "John Doe", "1234567", "johndoe");

        // When & Then
        assertThrows(SprintRequiredException.class, () -> {
            SprintTeamBuilder.builder()
                    .addUser(user)
                    .build();
        });
    }

    @Test
    @DisplayName("User 없이 팀을 생성할 경우 예외 발생")
    void createTeamWithoutUserThrowsException() {
        // Given
        Sprint sprint = SprintBuilder.builder()
                .name("AI Sprint")
                .basicDescription("AI 연구 프로젝트")
                .detailDescription("딥러닝 및 머신러닝 활용")
                .recommendedFor("for me")
                .startAt(LocalDateTime.now())
                .endAt(LocalDateTime.now().plusDays(14))
                .announceAt(LocalDateTime.now().plusDays(15))
                .maxMembers(8)
                .build();

        // When & Then
        assertThrows(UserRequiredException.class, () -> {
            SprintTeamBuilder.builder()
                    .participateSprint(sprint)
                    .build();
        });
    }
}
