package ssafy.com.ssacle.sprint.service;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;
import ssafy.com.ssacle.SprintCategory.domain.SprintCategory;
import ssafy.com.ssacle.SprintCategory.repository.SprintCategoryRepository;
import ssafy.com.ssacle.category.domain.Category;
import ssafy.com.ssacle.category.dto.CategoryNameAndLevelResponseDTO;
import ssafy.com.ssacle.category.dto.CategoryResponse;
import ssafy.com.ssacle.category.repository.CategoryRepository;
import ssafy.com.ssacle.diary.dto.DiaryGroupedByDateResponse;
import ssafy.com.ssacle.diary.service.DiaryService;
import ssafy.com.ssacle.notion.service.NotionService;
import ssafy.com.ssacle.presentation.domain.PresentationStatus;
import ssafy.com.ssacle.presentation.dto.PresentationStatusUpdateResponseDTO;
import ssafy.com.ssacle.questioncard.dto.QuestionCardResponse;
import ssafy.com.ssacle.questioncard.service.QuestionCardService;
import ssafy.com.ssacle.presentation.domain.PresentationStatus;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.sprint.domain.SprintBuilder;
import ssafy.com.ssacle.sprint.dto.*;
import ssafy.com.ssacle.presentation.exception.PresentationAlreadyEndedException;
import ssafy.com.ssacle.presentation.exception.PresentationInvalidStepException;
import ssafy.com.ssacle.sprint.exception.SprintAnnouncementNotYetException;
import ssafy.com.ssacle.sprint.exception.SprintNotExistException;
import ssafy.com.ssacle.sprint.exception.SprintUnauthorizedException;
import ssafy.com.ssacle.sprint.exception.UserParticipatedException;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.team.domain.SprintTeamBuilder;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.dto.TeamResponse;
import ssafy.com.ssacle.team.dto.TeamWinnerResponseDTO;
import ssafy.com.ssacle.team.dto.TeamWithMembersDTO;
import ssafy.com.ssacle.team.exception.TeamNameExistException;
import ssafy.com.ssacle.team.exception.TeamNotFoundException;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.todo.domain.DefaultTodo;
import ssafy.com.ssacle.todo.domain.Todo;
import ssafy.com.ssacle.todo.dto.DefaultTodoResponse;
import ssafy.com.ssacle.todo.dto.TodoContent;
import ssafy.com.ssacle.todo.dto.TodoResponseDTO;
import ssafy.com.ssacle.todo.repository.TodoRepository;
import ssafy.com.ssacle.todo.service.DefaultTodoService;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.dto.UserResponse;
import ssafy.com.ssacle.user.dto.UserResponseDTO;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.usercategory.domain.UserCategory;
import ssafy.com.ssacle.usercategory.repository.UserCategoryRepository;
import ssafy.com.ssacle.userteam.domain.UserTeam;
import ssafy.com.ssacle.userteam.repository.UserTeamRepository;

import java.time.LocalDateTime;
import java.util.*;
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
    private final UserRepository userRepository;
    private final QuestionCardService questionCardService;
    private final DiaryService diaryService;

    public void validateUserParticipation(Long userId, Long sprintId) {
        boolean isParticipating = userTeamRepository.countByUserIdAndSprintId(userId, sprintId) > 0;

        if (!isParticipating) {
            throw new SprintUnauthorizedException();
        }
    }

    public void validateUserNotParticipation(Long userId, Long sprintId) {
        boolean isParticipating = userTeamRepository.countByUserIdAndSprintId(userId, sprintId) > 0;

        if (isParticipating) {
            throw new UserParticipatedException();
        }
    }

    public void validateIsSprint(Long sprintId){
        if (!sprintRepository.existsById(sprintId)) {
            throw new SprintNotExistException();
        }

    }

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
    public Long joinSprint(Long sprintId, User user, String teamName) {
        Sprint sprint = sprintRepository.findByIdWithTeams(sprintId)
                .orElseThrow(SprintNotExistException::new);
        if(teamRepository.existsByName(teamName))
            throw new TeamNameExistException();

        List<DefaultTodoResponse> defaultTodos = defaultTodoService.getDefaultTodosBySprintId(sprintId);
        List<CategoryNameAndLevelResponseDTO> categories = categoryRepository.findCategoryNamesBySprintId(sprintId);

        // 스프린트 <-> 팀 <-> 사용자팀 <-> 사용자 연동
        Team team = saveTeamAndTeamUser(user, sprint, teamName);

        // 팀 <-> 노션 연동
//        String notionUrl = saveNotion(teamName, defaultTodos, categories);
//        team.setNotionURL(notionUrl);

        // 팀 <-> 투두 연동
        saveTodo(team, defaultTodos);

        return team.getId();
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

    private Team saveTeamAndTeamUser(User user, Sprint sprint, String teamName){
        Team team = SprintTeamBuilder.builder()
                .addUser(user)
                .participateSprint(sprint)
                .teamName(teamName)
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

                            team.addTodo(todo);
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
        Page<Sprint> sprints = sprintRepository.findSprintsByCategoryAndStatus(categoryId, status, pageable);

        List<SprintAndCategoriesResponseDTO> sprintDTOs = sprints.stream()
                .map(SprintAndCategoriesResponseDTO::from)
                .collect(Collectors.toList());

        return PageableExecutionUtils.getPage(sprintDTOs, pageable, sprints::getTotalElements);
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

    @Transactional(readOnly = true)
    public Page<UserSprintResponseDTO> getUserOngoingSprints(User user, Pageable pageable) {
        return sprintRepository.findUserParticipatedSprints(user, List.of(0, 1), pageable)
                .map(sprint -> {
                    Long teamId = sprintRepository.findTeamIdBySprintAndUser(sprint, user);
                    return UserSprintResponseDTO.from(sprint, teamId);
                });
    }

    @Transactional(readOnly = true)
    public Page<UserSprintResponseDTO> getUserCompletedSprints(User user, Pageable pageable) {
        return sprintRepository.findUserParticipatedSprints(user, List.of(2), pageable)
                .map(sprint -> {
                    Long teamId = sprintRepository.findTeamIdBySprintAndUser(sprint, user);
                    return UserSprintResponseDTO.from(sprint, teamId);
                });
    }

    @Transactional
    public ActiveSprintResponse getActiveSprint(Long sprintId, Long teamId) {
        // 1. 스프린트 정보 가져오기
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(SprintNotExistException::new);
        SingleSprintResponse sprintResponse = SingleSprintResponse.from(sprint);

        // 2. 스프린트 관련 카테고리 가져오기
        List<CategoryResponse> categories = sprintRepository.findWithSprintCategoriesById(sprintId)
                .map(s -> s.getSprintCategories().stream()
                        .map(sprintCategory -> CategoryResponse.from(sprintCategory.getCategory()))
                        .collect(Collectors.toList()))
                .orElse(List.of());

        // 3. 스프린트 관련 질문 카드 가져오기
        List<QuestionCardResponse> questionCards = questionCardService.getQuestionCardsBySprint(sprintId);

        // 4. 특정 팀 정보 가져오기
        Team team = teamRepository.findById(teamId)
                .orElseThrow(TeamNotFoundException::new);
        TeamResponse teamResponse = TeamResponse.from(team);

        // 5. 특정 팀의 Todo 가져오기
        List<TodoResponseDTO> todos = todoRepository.findByTeam(team)
                .stream()
                .collect(Collectors.groupingBy(Todo::getDate))
                .entrySet()
                .stream()
                .map(entry -> new TodoResponseDTO(
                        entry.getKey(),
                        entry.getValue().stream()
                                .map(todo -> new TodoContent(todo.getId(), todo.getContent(), todo.isDone()))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());

        // 6. 특정 스프린트의 모든 팀의 다이어리 가져오기
        List<DiaryGroupedByDateResponse> diaries = diaryService.getDiariesBySprint(sprintId);

        return ActiveSprintResponse.builder()
                .sprint(sprintResponse)
                .categories(categories)
                .questionCards(questionCards)
                .team(teamResponse)
                .todos(todos)
                .diaries(diaries)
                .build();
    }

    @Transactional
    public List<SprintSummaryResponse> getParticipateSprint(User user) {

        List<Team> teams = teamRepository.findTeamsByUserId(user.getId());
        if (teams.isEmpty()) {
            return Collections.emptyList();
        }

        Map<Long, Long> sprintToTeamMap = teams.stream()
                .collect(Collectors.toMap(team -> team.getSprint().getId(), Team::getId, (existing, replacement) -> existing)); // 중복 Sprint ID는 기존 값 유지

        List<Long> sprintIds = new ArrayList<>(sprintToTeamMap.keySet());

        List<Sprint> sprints = sprintRepository.findSprintsByTeamIds(sprintIds);

        // ✅ Sprint와 Team ID 매핑하여 Response 생성
        return sprints.stream()
                .map(sprint -> {
                    Long teamId = sprintToTeamMap.getOrDefault(sprint.getId(), null); // 매핑된 팀 ID 가져오기
                    return SprintSummaryResponse.of(sprint, teamId);
                })
                .toList();
    }


    @Transactional
    public List<SprintRecommendResponseDTO> getRecommendSprint(User user) {
        List<UserCategory> userCategories = userCategoryRepository.findByUserId(user.getId());
        List<Long> interestedMiddleCategoryIds = userCategories.stream()
                .map(userCategory -> userCategory.getCategory().getId())
                .collect(Collectors.toList());

        log.info("사용자의 관심 중간 카테고리 ID 목록: {}", interestedMiddleCategoryIds);
        if (interestedMiddleCategoryIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Category> lowestLevelCategories = categoryRepository.findLowestLevelCategories();
        List<Long> validLowestCategoryIds = lowestLevelCategories.stream()
                .filter(category -> category.getParent() != null &&
                        interestedMiddleCategoryIds.contains(category.getParent().getId()))
                .map(Category::getId)
                .collect(Collectors.toList());

        log.info("사용자의 관심 중간 카테고리와 연결된 최하위 카테고리 ID 목록: {}", validLowestCategoryIds);
        if (validLowestCategoryIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<SprintCategory> relatedSprintCategories = sprintCategoryRepository.findByCategoryIdIn(validLowestCategoryIds);
        List<Sprint> relatedSprints = relatedSprintCategories.stream()
                .map(SprintCategory::getSprint)
                .collect(Collectors.toList());

        log.info("추천 가능한 스프린트 개수: {}", relatedSprints.size());

        List<UserTeam> userTeams = userTeamRepository.findByUserId(user.getId());
        Set<Long> joinedSprintIds = userTeams.stream()
                .map(userTeam -> userTeam.getTeam().getSprint().getId())
                .collect(Collectors.toSet());

        List<Sprint> unjoinedSprints = relatedSprints.stream()
                .filter(sprint -> !joinedSprintIds.contains(sprint.getId()))
//                .filter(sprint -> !joinedSprintIds.contains(sprint.getId()) && sprint.getStartAt().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList());

        log.info("사용자가 참여하지 않은 추천 가능한 스프린트 개수: {}", unjoinedSprints.size());

        return unjoinedSprints.stream()
                .map(sprint -> {
                    if (sprint.getSprintCategories().isEmpty()) {
                        log.warn("🚨 Sprint ID {}에 연결된 카테고리가 없음", sprint.getId());
                        return null;
                    }
                    Category category = sprint.getSprintCategories().get(0).getCategory();

                    return SprintRecommendResponseDTO.builder()
                            .id(sprint.getId())
                            .majorCategoryName(category.getMajorCategoryName())
                            .subCategoryName(category.getSubCategoryName())
                            .title(sprint.getName())
                            .description(sprint.getBasicDescription())
                            .start_at(sprint.getStartAt().toLocalDate())
                            .end_at(sprint.getEndAt().toLocalDate())
                            .currentMembers(sprint.getCurrentMembers())
                            .maxMembers(sprint.getMaxMembers())
                            .imageUrl(category.getImage())
                            .build();
                })
                .filter(Objects::nonNull) // null 값 제거
                .collect(Collectors.toList());
    }

    @Transactional
    public void initial_Presentation(Long sprintId){
        Sprint sprint = sprintRepository.findById(sprintId).orElseThrow(SprintNotExistException::new);
        if(LocalDateTime.now().isBefore(sprint.getAnnounceAt())){
            throw new SprintAnnouncementNotYetException();
        }
    }
    public PresentationStatusUpdateResponseDTO updatePresentationStatus(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(SprintNotExistException::new);
        // 현재 상태의 다음 상태로 업데이트
        PresentationStatus nextStatus = PresentationStatus.getNextStatus(sprint.getPresentationStatus());
        if (nextStatus == null) {
            throw new PresentationAlreadyEndedException();
        }
//        if(nextStatus.getStep() != sprint.getPresentationStatus().getStep()+1){
//            throw new PresentationInvalidStepException();
//        }
        sprint.updatePresentationStatus(nextStatus);
        sprintRepository.save(sprint);

        return new PresentationStatusUpdateResponseDTO("발표 상태 업데이트 성공", sprint.getPresentationStatus());
    }

    @Transactional(readOnly = true)
    public boolean checkPresentationAvailability(Long sprintId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(SprintNotExistException::new);
        // 발표 시작 시간(announced_at) 30분전부터 입장 가능하며 해당 시간이 아니면 입장할 수 없는 로직 구현
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime presentationStartTime = sprint.getAnnounceAt().minusMinutes(30);
        LocalDateTime presentationEndTime = sprint.getAnnounceAt();

        return now.isAfter(presentationStartTime) && now.isBefore(presentationEndTime);
    }

    public List<UserResponseDTO> getPresentationParticipants(Long sprintId) {
        //Sprint sprint = sprintRepository.findById(sprintId).orElseThrow(SprintNotExistException::new);
        List<Team> teams = teamRepository.findBySprintIdWithUserTeams(sprintId);
        List<Long> userIds = teams.stream()
                .flatMap(team -> team.getUserTeams().stream())
                .map(userTeam -> userTeam.getUser().getId())
                .distinct()
                .collect(Collectors.toList());
        List<User> users = userRepository.findByIdIn(userIds);
        return users.stream()
                .map(user-> UserResponseDTO.of(user,null))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<UserResponse> getUsersBySprintId(Long sprintId) {

        List<Long> teamIds = teamRepository.findTeamIdsBySprintId(sprintId);

        List<Long> userIds = userRepository.findUserIdsByTeamIds(teamIds);

        return userRepository.findUsersByIds(userIds)
                .stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
    }
}
