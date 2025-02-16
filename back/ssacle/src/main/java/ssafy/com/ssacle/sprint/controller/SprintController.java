package ssafy.com.ssacle.sprint.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.com.ssacle.sprint.dto.*;
import ssafy.com.ssacle.sprint.service.SprintService;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.service.UserService;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SprintController implements SprintSwaggerController{
    private final UserService userService;
    private final SprintService sprintService;

    /** 스프린트 생성 */
    @Override
    public ResponseEntity<SprintResponse> createSprint(@RequestBody SprintCreateRequest request) {
        SprintResponse response = sprintService.createSprint(request);

        return ResponseEntity.status(201).body(response);
    }

    /** 스프린트 참가 */
    @Override
    public ResponseEntity<Long> joinSprint(@PathVariable Long sprintId,  @RequestParam String teamName) {
        User user = userService.getAuthenticatedUserWithTeams();
        Long teamId = sprintService.joinSprint(sprintId, user, teamName);

        return ResponseEntity.status(201).body(teamId);
    }

    /** 필터링 조건으로 스프린트 조회 */
    @Override
    public ResponseEntity<Page<SprintAndCategoriesResponseDTO>> getSprintsByCategoryAndStatus(Long categoryId, Integer status, Pageable pageable) {
        Page<SprintAndCategoriesResponseDTO> sprintResponses;

        if (categoryId == null) {
            // 카테고리 ID가 없으면 상태만 필터링
            sprintResponses = sprintService.getSprintsByStatus(status, pageable);
        } else {
            // 카테고리 ID가 있으면 카테고리 + 상태 필터링
            sprintResponses = sprintService.getSprintsByCategoryAndStatus(categoryId, status, pageable);
        }

        return ResponseEntity.ok(sprintResponses);
    }

    /** 사용자가 참여중인 스프린트 목록 (status: 0,1) */
    @Override
    public ResponseEntity<Page<UserSprintResponseDTO>> getOngoingSprints(Pageable pageable) {
        User user = userService.getAuthenticatedUserWithTeams();
        return ResponseEntity.ok(sprintService.getUserOngoingSprints(user, pageable));
    }

    /** 사용자가 참여 완료한 스프린트 목록 */
    @Override
    public ResponseEntity<Page<UserSprintResponseDTO>> getCompletedSprints(Pageable pageable) {
        User user = userService.getAuthenticatedUserWithTeams();
        return ResponseEntity.ok(sprintService.getUserCompletedSprints(user, pageable));
    }

    /** 단일 스프린트 조회 */
    @Override
    public ResponseEntity<SingleSprintResponse> getSprintById(@PathVariable Long id) {
        SingleSprintResponse response = sprintService.getSprintById(id);
        return ResponseEntity.ok(response);
    }

    /** 스프린트 입장 페이지에 필요한 단일 스프린트 조회 */
    @Override
    public ResponseEntity<SprintDetailResponse> getSprintDetails(@PathVariable Long sprintId) {
        SprintDetailResponse response = sprintService.getSprintDetail(sprintId);
        return ResponseEntity.ok(response);
    }

    /** 활동중인 스프린트에 필요한 데이터 */
    @Override
    public ResponseEntity<ActiveSprintResponse> getActiveSprint(Long sprintId, Long teamId) {
        ActiveSprintResponse response = sprintService.getActiveSprint(sprintId, teamId);
        return ResponseEntity.ok(response);
    }

}
