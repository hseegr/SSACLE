package ssafy.com.ssacle.sprint.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.SprintCategory.domain.SprintCategory;
import ssafy.com.ssacle.SprintCategory.repository.SprintCategoryRepository;
import ssafy.com.ssacle.category.domain.Category;
import ssafy.com.ssacle.category.dto.CategoryNameAndLevelResponseDTO;
import ssafy.com.ssacle.category.dto.CategoryResponse;
import ssafy.com.ssacle.category.repository.CategoryRepository;
import ssafy.com.ssacle.notion.service.NotionService;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.sprint.domain.SprintBuilder;
import ssafy.com.ssacle.sprint.dto.*;
import ssafy.com.ssacle.sprint.exception.SprintNotExistException;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.team.domain.SprintTeamBuilder;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.todo.domain.DefaultTodo;
import ssafy.com.ssacle.todo.domain.QDefaultTodo;
import ssafy.com.ssacle.todo.domain.Todo;
import ssafy.com.ssacle.todo.dto.DefaultTodoResponse;
import ssafy.com.ssacle.todo.repository.DefaultTodoRepository;
import ssafy.com.ssacle.todo.repository.TodoRepository;
import ssafy.com.ssacle.todo.service.DefaultTodoService;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.usercategory.domain.UserCategory;
import ssafy.com.ssacle.usercategory.repository.UserCategoryRepository;
import ssafy.com.ssacle.userteam.domain.UserTeam;
import ssafy.com.ssacle.userteam.repository.UserTeamRepository;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SprintService {
    private final SprintRepository sprintRepository;
    private final CategoryRepository categoryRepository;
    private final TeamRepository teamRepository;
    private final SprintCategoryRepository sprintCategoryRepository;
    private final DefaultTodoService defaultTodoService;
    private final TodoRepository todoRepository;
    private final NotionService notionService;
    private final UserCategoryRepository userCategoryRepository;
    private final UserTeamRepository userTeamRepository;
    @Transactional
    public SprintResponse createSprint(SprintCreateRequest request) {
        Sprint sprint = SprintBuilder.builder()
                .name(request.getName())
                .basicDescription(request.getBasicDescription())
                .detailDescription(request.getDetailDescription())
                .recommendedFor(request.getRecommendedFor())
                .startAt(request.getStartAt())
                .endAt(request.getEndAt())
                .announceAt(request.getAnnounceAt())
                .maxMembers(request.getMaxMembers())
                .defaultTodos(request.getTodos())
                .build();

        sprintRepository.save(sprint);

        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
            categories.forEach(category -> {
                SprintCategory sprintCategory = new SprintCategory(sprint, category);
                sprintCategoryRepository.save(sprintCategory);
            });
        }

        return new SprintResponse("싸프린트가 성공적으로 생성되었습니다.", sprint.getId());
    }

    @Transactional
    public void joinSprint(Long sprintId, User user) {
        Sprint sprint = sprintRepository.findByIdWithTeams(sprintId)
                .orElseThrow(SprintNotExistException::new);

        List<DefaultTodoResponse> defaultTodos = defaultTodoService.getDefaultTodosBySprintId(sprintId);
        List<CategoryNameAndLevelResponseDTO> categories = categoryRepository.findCategoryNamesBySprintId(sprintId);

        // 스프린트 <-> 팀 <-> 사용자팀 <-> 사용자 연동
        Team team = saveTeamAndTeamUser(user, sprint);
        // 팀 <-> 노션 연동
        String notionUrl = saveNotion(user.getName(), defaultTodos, categories);
        team.setNotionURL(notionUrl);

        // 팀 <-> 투두 연동
        saveTodo(team, defaultTodos);
    }

    private String saveNotion(String teamName, List<DefaultTodoResponse> defaultTodoResponses, List<CategoryNameAndLevelResponseDTO> categoryNameAndLevelResponseDTOS){

        String category1 = categoryNameAndLevelResponseDTOS.get(0).getCategoryName();
        String category2 = categoryNameAndLevelResponseDTOS.get(1).getCategoryName();
        String category3 = categoryNameAndLevelResponseDTOS.get(2).getCategoryName();

        // Notion 계층 구조 생성 및 팀 페이지 ID 반환
        String teamPageId = notionService.createCategoryStructure(category1, category2, category3, teamName);

        // 날짜별 페이지 생성
        if (teamPageId != null) {
            notionService.createDailyPages(teamPageId, defaultTodoResponses);
        } else {
            System.out.println("팀 페이지 생성 실패, 날짜별 페이지 생성 스킵");
        }

        return teamPageId;
    }

    private Team saveTeamAndTeamUser(User user, Sprint sprint){
        Team team = SprintTeamBuilder.builder()
                .addUser(user)
                .participateSprint(sprint)
                .build();

        return teamRepository.save(team);
    }

    private void saveTodo(Team team, List<DefaultTodoResponse> defaultTodoResponses) {
        List<Todo> todos = defaultTodoResponses.stream()
                .flatMap(defaultTodo -> defaultTodo.getTasks().stream()
                        .map(task -> {
                            Todo todo = Todo.builder()
                                    .team(team)
                                    .content(task)
                                    .date(defaultTodo.getDate())
                                    .isDone(false)
                                    .build();

                            team.addTodo(todo); // ✅ 연관관계 설정
                            return todo;
                        }))
                .collect(Collectors.toList());

        todoRepository.saveAll(todos);
    }

    public SingleSprintResponse getSprintById(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(SprintNotExistException::new);

        return SingleSprintResponse.from(sprint);
    }

    @Transactional
    public Page<SprintAndCategoriesResponseDTO> getSprintsByCategoryAndStatus(Long categoryId, Integer status, Pageable pageable) {
        return sprintRepository.findSprintsByCategoryAndStatus(categoryId, status, pageable)
                .map(SprintAndCategoriesResponseDTO::from);
    }

    @Transactional
    public Page<SprintAndCategoriesResponseDTO> getSprintsByStatus(Integer status, Pageable pageable) {
        return sprintRepository.findSprintsByStatus(status, pageable)
                .map(SprintAndCategoriesResponseDTO::from);
    }


    public SprintDetailResponse getSprintDetail(Long sprintId) {

        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(SprintNotExistException::new);

        List<DefaultTodo> defaultTodos = sprintRepository.findWithDefaultTodosById(sprintId)
                .map(Sprint::getDefaultTodos)
                .orElse(Collections.emptyList());

        List<SprintCategory> sprintCategories = sprintRepository.findWithSprintCategoriesById(sprintId)
                .map(Sprint::getSprintCategories)
                .orElse(Collections.emptyList());

        SingleSprintResponse sprintResponse = SingleSprintResponse.from(sprint);
        List<DefaultTodoResponse> todos = DefaultTodoResponse.fromEntities(defaultTodos);
        List<CategoryResponse> categories = sprintCategories.stream()
                .map(sprintCategory -> CategoryResponse.from(sprintCategory.getCategory()))
                .toList();

        return SprintDetailResponse.builder()
                .sprint(sprintResponse)
                .todos(todos)
                .categories(categories)
                .build();
    }

    @Transactional
    public List<SprintSummaryResponse> getParicipateSprint(User user) {
        List<Team> teams = teamRepository.findTeamsByUserId(user.getId());
        if (teams.isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> teamIds = teams.stream().map(Team::getId).toList();
        List<Sprint> sprints = sprintRepository.findSprintsByTeamIds(teamIds);

        return sprints.stream()
                .map(SprintSummaryResponse::of)
                .toList();
    }
    @Transactional
    public List<SprintRecommendResponseDTO> getRecommendSprint(User user) {
        // 1. 사용자의 관심 카테고리(중간 카테고리) 가져오기
        List<UserCategory> userCategories = userCategoryRepository.findByUserId(user.getId());
        List<Long> interestedMiddleCategoryIds = userCategories.stream()
                .map(userCategory -> userCategory.getCategory().getId())
                .collect(Collectors.toList());

        log.info("사용자의 관심 중간 카테고리 ID 목록: {}", interestedMiddleCategoryIds);
        if (interestedMiddleCategoryIds.isEmpty()) {
            return Collections.emptyList(); // 관심 카테고리가 없으면 추천 스프린트 없음
        }

// 2. 모든 최하위 카테고리 가져오기
        List<Category> lowestLevelCategories = categoryRepository.findLowestLevelCategories();

// 3. 최하위 카테고리 중에서 부모가 사용자의 관심 중간 카테고리와 일치하는 것만 필터링
        List<Long> validLowestCategoryIds = lowestLevelCategories.stream()
                .filter(category -> category.getParent() != null &&
                        interestedMiddleCategoryIds.contains(category.getParent().getId()))
                .map(Category::getId)
                .collect(Collectors.toList());

        log.info("사용자의 관심 중간 카테고리와 연결된 최하위 카테고리 ID 목록: {}", validLowestCategoryIds);

        if (validLowestCategoryIds.isEmpty()) {
            return Collections.emptyList(); // 사용자의 관심 카테고리와 연결된 최하위 카테고리가 없으면 추천할 스프린트 없음
        }

// 4. 해당하는 최하위 카테고리에 속한 스프린트 조회
        List<SprintCategory> relatedSprintCategories = sprintCategoryRepository.findByCategoryIdIn(validLowestCategoryIds);
        List<Sprint> relatedSprints = relatedSprintCategories.stream()
                .map(SprintCategory::getSprint)
                .collect(Collectors.toList());

        log.info("추천 가능한 스프린트 개수: {}", relatedSprints.size());

// 5. 이미 참여한 스프린트 제외 (시작 전인 것만 필터링)
        List<UserTeam> userTeams = userTeamRepository.findByUserId(user.getId());
        Set<Long> joinedSprintIds = userTeams.stream()
                .map(userTeam -> userTeam.getTeam().getSprint().getId())
                .collect(Collectors.toSet());

        List<Sprint> unjoinedSprints = relatedSprints.stream()
                .filter(sprint -> !joinedSprintIds.contains(sprint.getId()))
//                .filter(sprint -> !joinedSprintIds.contains(sprint.getId()) && sprint.getStartAt().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList());

        log.info("사용자가 참여하지 않은 추천 가능한 스프린트 개수: {}", unjoinedSprints.size());

// 6. 추천 스프린트 목록 반환
        return unjoinedSprints.stream()
                .map(sprint -> SprintRecommendResponseDTO.builder()
                        .id(sprint.getId())
                        .categoryName(
                                sprint.getSprintCategories().isEmpty() ? "Unknown"
                                        : sprint.getSprintCategories().get(0).getCategory().getCategoryName()
                        )
                        .title(sprint.getName())
                        .description(sprint.getBasicDescription())
                        .start_at(sprint.getStartAt().toLocalDate()) // LocalDateTime → LocalDate 변환
                        .end_at(sprint.getEndAt().toLocalDate()) // LocalDateTime → LocalDate 변환
                        .currentMembers(sprint.getCurrentMembers())
                        .maxMembers(sprint.getMaxMembers())
                        .imageUrl(sprint.getSprintCategories().isEmpty() ? null
                                : sprint.getSprintCategories().get(0).getCategory().getImage()) // 카테고리 이미지 활용
                        .build())
                .collect(Collectors.toList());

    }


}
