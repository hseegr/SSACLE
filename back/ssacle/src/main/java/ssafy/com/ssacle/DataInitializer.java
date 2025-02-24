package ssafy.com.ssacle;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;
import ssafy.com.ssacle.SprintCategory.domain.SprintCategory;
import ssafy.com.ssacle.SprintCategory.repository.SprintCategoryRepository;
import ssafy.com.ssacle.ainews.domain.AINews;
import ssafy.com.ssacle.ainews.repository.AINewsRepository;
import ssafy.com.ssacle.board.domain.Board;
import ssafy.com.ssacle.board.domain.BoardType;
import ssafy.com.ssacle.board.exception.BoardErrorCode;
import ssafy.com.ssacle.board.exception.BoardException;
import ssafy.com.ssacle.board.repository.BoardRepository;
import ssafy.com.ssacle.board.repository.BoardTypeRepository;
import ssafy.com.ssacle.category.domain.Category;
import ssafy.com.ssacle.category.exception.CategoryErrorCode;
import ssafy.com.ssacle.category.exception.CategoryException;
import ssafy.com.ssacle.category.exception.CategoryNotExistException;
import ssafy.com.ssacle.category.repository.CategoryRepository;
import ssafy.com.ssacle.comment.domain.Comment;
import ssafy.com.ssacle.comment.repository.CommentRepository;
import ssafy.com.ssacle.diary.domain.Diary;
import ssafy.com.ssacle.diary.service.DiaryService;
import ssafy.com.ssacle.lunch.domain.Lunch;
import ssafy.com.ssacle.lunch.repository.LunchRepository;
import ssafy.com.ssacle.questioncard.dto.QuestionCardRequest;
import ssafy.com.ssacle.questioncard.service.QuestionCardService;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.sprint.domain.SprintBuilder;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.sprint.service.SprintService;
import ssafy.com.ssacle.ssaldcup.domain.SsaldCup;
import ssafy.com.ssacle.ssaldcup.domain.SsaldCupBuilder;
import ssafy.com.ssacle.ssaldcup.repository.SsaldCupRepository;
import ssafy.com.ssacle.ssaldcupcategory.domain.SsaldCupCategory;
import ssafy.com.ssacle.ssaldcupcategory.repository.SsaldCupCategoryRepository;
import ssafy.com.ssacle.team.domain.SprintTeamBuilder;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.dto.TeamResponse;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.todo.dto.TodoRequest;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.exception.CannotLoginException;
import ssafy.com.ssacle.user.exception.LoginErrorCode;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.usercategory.domain.UserCategory;
import ssafy.com.ssacle.usercategory.repository.UserCategoryRepository;
import ssafy.com.ssacle.userteam.domain.UserTeam;
import ssafy.com.ssacle.userteam.repository.UserTeamRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            UserCategoryRepository userCategoryRepository,
            BoardTypeRepository boardTypeRepository,
            BoardRepository boardRepository,
            CommentRepository commentRepository,
            AINewsRepository aiNewsRepository,
            LunchRepository lunchRepository,
            SprintRepository sprintRepository,
            TeamRepository teamRepository,
            UserTeamRepository userTeamRepository,
            SprintCategoryRepository sprintCategoryRepository,
            SprintService sprintService,
            QuestionCardService questionCardService,
            DiaryService diaryService,
            SsaldCupRepository ssaldCupRepository,
            SsaldCupCategoryRepository ssaldCupCategoryRepository
    ) {
        return args -> {
            initializeUsers(userRepository);
            initializeCategory(categoryRepository);
            initializeUserCategories(userRepository, categoryRepository, userCategoryRepository);
            initializeBoardType(boardTypeRepository);
            initializeBoard(boardRepository, boardTypeRepository, userRepository);
//            initializeComments(commentRepository, boardRepository, userRepository);
//            initializeReplies(commentRepository, userRepository);
            initializeAINews(aiNewsRepository);
            initializeLunch(lunchRepository);
            initializeSprints(sprintRepository,categoryRepository,sprintCategoryRepository);
//            initializeSprintParticipation(sprintRepository, userRepository, teamRepository, sprintService, questionCardService, diaryService);
//            initializeTeams(sprintRepository,teamRepository,userRepository,userTeamRepository);
        };
    }

    @Transactional
    public void initializeUsers(UserRepository userRepository) {
        if (userRepository.count() == 0) { // 기존 데이터가 없을 경우에만 추가
            User admin1 = User.createAdmin("admin1@example.com", "admin1234", "김관리");
            User admin2 = User.createAdmin("admin2@example.com", "admin1234", "박관리");
            User admin3 = User.createAdmin("admin3@example.com", "admin1234", "최관리");

            User user1 = User.createStudent("ssafy1@ssafy.com", "ssafy1234", "김싸피", "1234567", "내 혈액형은 B형");
            User user2 = User.createStudent("ssafy2@ssafy.com", "ssafy1234", "이싸피", "1234987", "응애 백엔드");
            User user3 = User.createStudent("ssafy3@ssafy.com", "ssafy1234", "최싸피", "1234321", "난 말하는 감자");
            User user4 = User.createStudent("ssafy4@ssafy.com", "ssafy1234", "박싸피", "1234654", "B형 주세요");
            User user5 = User.createStudent("ssafy5@ssafy.com", "ssafy1234", "전싸피", "1234588", "자고 싶어요");
            User user6 = User.createStudent("ssafy6@ssafy.com", "ssafy1234", "권싸피", "1234123", "열정 두배요");
            User user7 = User.createStudent("ssafy7@ssafy.com", "ssafy1234", "신싸피", "1334123", "열정 세배인데요");
            User user8 = User.createStudent("ssafy8@ssafy.com", "ssafy1234", "조싸피", "1334567", "응애 싸피인");
            User user9 = User.createStudent("ssafy9@ssafy.com", "ssafy1234", "강싸피", "1335056", "나의 꿈은 싸탈이야");
            User user10 = User.createStudent("ssafy10@ssafy.com", "ssafy1234", "정싸피", "1212121", "싸피 인생 12회차");
            User user11 = User.createStudent("spancer1@naver.com", "rlatngus@1", "김수현", "1240587", "응애응애 까르륵");


            User alumni1 = User.createAlumni("ssafy11@ssafy.com", "ssafy1234", "김졸업", "1112121", "KB 국민 은행");
            User alumni2 = User.createAlumni("ssafy12@ssafy.com", "ssafy1234", "박졸업", "1112345", "싸피 실습 코치");
            User alumni3 = User.createAlumni("ssafy13@ssafy.com", "ssafy1234", "전졸업", "1012345", "혈액형은 B형 난 C형");
            userRepository.save(admin1);
            userRepository.save(admin2);
            userRepository.save(admin3);
            userRepository.save(user1);
            userRepository.save(user2);
            userRepository.save(user3);
            userRepository.save(user4);
            userRepository.save(user5);
            userRepository.save(user6);
            userRepository.save(user7);
            userRepository.save(user8);
            userRepository.save(user9);
            userRepository.save(user10);
            userRepository.save(user11);
            userRepository.save(alumni1);
            userRepository.save(alumni2);
            userRepository.save(alumni3);

            System.out.println("default data added");
        } else {
            System.out.println("default data already exists");
        }
    }

    @Transactional
    public void initializeCategory(CategoryRepository categoryRepository) {
        if (categoryRepository.count() == 0) {
            // 상위 카테고리 생성
            Category backEnd = Category.builder().categoryName("Back-end").level(1).build();
            Category frontEnd = Category.builder().categoryName("Front-end").level(1).build();
            Category infra = Category.builder().categoryName("Infra").level(1).build();
            Category database = Category.builder().categoryName("Database").level(1).build();
            Category mobile = Category.builder().categoryName("Mobile").level(1).build();
            Category devOps = Category.builder().categoryName("DevOps").level(1).build();
            Category aiMl = Category.builder().categoryName("AI/ML").level(1).build();
            Category security = Category.builder().categoryName("Security").level(1).build();

            categoryRepository.saveAll(List.of(backEnd, frontEnd, infra, database, mobile, devOps, aiMl, security));

            // Back-end 중간 카테고리
            Category spring = Category.builder().categoryName("Spring").parent(backEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Spring.png").level(2).build();
            Category django = Category.builder().categoryName("Django").parent(backEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Django.png").level(2).build();
            Category nodejs = Category.builder().categoryName("Node.js").parent(backEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Node.png").level(2).build();
            Category nestjs = Category.builder().categoryName("NestJS").parent(backEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/NestJS.png").level(2).build();
            Category flask = Category.builder().categoryName("Flask").parent(backEnd).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Flask.png").build();
            Category laravel = Category.builder().categoryName("Laravel").parent(backEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Laravel.png").level(2).build();

            categoryRepository.saveAll(List.of(spring, django, nodejs, nestjs, flask, laravel));

            // Back-end 하위 카테고리
            List<Category> backEndChildren = List.of(
                    Category.builder().categoryName("Spring Boot").parent(spring).level(3).build(),
                    Category.builder().categoryName("Spring MVC").parent(spring).level(3).build(),
                    Category.builder().categoryName("Spring Security").parent(spring).level(3).build(),
                    Category.builder().categoryName("Django ORM").parent(django).level(3).build(),
                    Category.builder().categoryName("Django REST Framework").parent(django).level(3).build(),
                    Category.builder().categoryName("Express.js").parent(nodejs).level(3).build(),
                    Category.builder().categoryName("NestJS Modules").parent(nestjs).level(3).build(),
                    Category.builder().categoryName("Flask RESTful").parent(flask).level(3).build(),
                    Category.builder().categoryName("Eloquent ORM").parent(laravel).level(3).build()
            );

            categoryRepository.saveAll(backEndChildren);

            // Front-end 중간 카테고리
            Category react = Category.builder().categoryName("React").parent(frontEnd).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/React.png").build();
            Category vue = Category.builder().categoryName("Vue.js").parent(frontEnd).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Vue.png").build();
            Category angular = Category.builder().categoryName("Angular").parent(frontEnd).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Angular.png").build();
            Category svelte = Category.builder().categoryName("Svelte").parent(frontEnd).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/svelte.png").build();

            categoryRepository.saveAll(List.of(react, vue, angular, svelte));

            // Front-end 하위 카테고리
            List<Category> frontEndChildren = List.of(
                    Category.builder().categoryName("useState").parent(react).level(3).build(),
                    Category.builder().categoryName("useEffect").parent(react).level(3).build(),
                    Category.builder().categoryName("React Context API").parent(react).level(3).build(),
                    Category.builder().categoryName("Vue Router").parent(vue).level(3).build(),
                    Category.builder().categoryName("Vuex").parent(vue).level(3).build(),
                    Category.builder().categoryName("Angular DI").parent(angular).level(3).build(),
                    Category.builder().categoryName("Svelte Stores").parent(svelte).level(3).build()
            );

            categoryRepository.saveAll(frontEndChildren);

            // Database 중간 및 하위 카테고리
            Category mysql = Category.builder().categoryName("MySQL").parent(database).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/MySQL.png").build();
            Category postgresql = Category.builder().categoryName("PostgreSQL").parent(database).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/PostgreSQL.png").build();
            Category mongodb = Category.builder().categoryName("MongoDB").parent(database).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/MongoDB.png").build();
            Category redis = Category.builder().categoryName("Redis").parent(database).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Redis.png").build();

            categoryRepository.saveAll(List.of(mysql, postgresql, mongodb, redis));

            List<Category> databaseChildren = List.of(
                    Category.builder().categoryName("Indexing").parent(mysql).level(3).build(),
                    Category.builder().categoryName("ACID").parent(postgresql).level(3).build(),
                    Category.builder().categoryName("Sharding").parent(mongodb).level(3).build(),
                    Category.builder().categoryName("Cache Strategies").parent(redis).level(3).build()
            );

            categoryRepository.saveAll(databaseChildren);

            Category docker = Category.builder().categoryName("Docker").parent(infra).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Docker.png").build();
            Category kunernetes = Category.builder().categoryName("Kunernetes").parent(infra).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Kubernetes.png").build();
            Category googlecloud = Category.builder().categoryName("Google Cloud").parent(infra).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/GoogleCloud.png").build();
            Category azure = Category.builder().categoryName("Azure").parent(infra).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Azure.png").build();
            Category aws = Category.builder().categoryName("AWS").parent(infra).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/AWS.png").build();
            categoryRepository.saveAll(List.of(docker, kunernetes, googlecloud, azure, aws));

            Category android = Category.builder().categoryName("Android").parent(mobile).level(2)
                    .image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Android.png").build();
            Category ios = Category.builder().categoryName("iOS").parent(mobile).level(2)
                    .image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/iOS.png").build();
            categoryRepository.saveAll(List.of(android, ios));

// Mobile 하위 카테고리
            List<Category> mobileChildren = List.of(
                    Category.builder().categoryName("Jetpack Compose").parent(android).level(3).build(),
                    Category.builder().categoryName("Kotlin Coroutines").parent(android).level(3).build(),
                    Category.builder().categoryName("SwiftUI").parent(ios).level(3).build(),
                    Category.builder().categoryName("Combine").parent(ios).level(3).build()
            );
            categoryRepository.saveAll(mobileChildren);

// DevOps 중간 카테고리
            Category ciCd = Category.builder().categoryName("CI/CD").parent(devOps).level(2)
                    .image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/CICD.png").build();
            Category infraAsCode = Category.builder().categoryName("Infrastructure as Code").parent(devOps).level(2)
                    .image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/InfrastructureasCode.png").build();
            categoryRepository.saveAll(List.of(ciCd, infraAsCode));

// DevOps 하위 카테고리
            List<Category> devOpsChildren = List.of(
                    Category.builder().categoryName("Jenkins").parent(ciCd).level(3).build(),
                    Category.builder().categoryName("GitHub Actions").parent(ciCd).level(3).build(),
                    Category.builder().categoryName("Terraform").parent(infraAsCode).level(3).build(),
                    Category.builder().categoryName("Ansible").parent(infraAsCode).level(3).build()
            );
            categoryRepository.saveAll(devOpsChildren);

// AI/ML 중간 카테고리
            Category deepLearning = Category.builder().categoryName("Deep Learning").parent(aiMl).level(2)
                    .image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/DeepLearning.jpeg").build();
            Category mlOps = Category.builder().categoryName("MLOps").parent(aiMl).level(2)
                    .image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/MLOPs.png").build();
            categoryRepository.saveAll(List.of(deepLearning, mlOps));

// AI/ML 하위 카테고리
            List<Category> aiMlChildren = List.of(
                    Category.builder().categoryName("TensorFlow").parent(deepLearning).level(3).build(),
                    Category.builder().categoryName("PyTorch").parent(deepLearning).level(3).build(),
                    Category.builder().categoryName("Kubeflow").parent(mlOps).level(3).build(),
                    Category.builder().categoryName("MLflow").parent(mlOps).level(3).build()
            );
            categoryRepository.saveAll(aiMlChildren);

// Security 중간 카테고리
            Category networkSecurity = Category.builder().categoryName("Network Security").parent(security).level(2)
                    .image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/NetworkSecurity.png").build();
            Category appSecurity = Category.builder().categoryName("Application Security").parent(security).level(2)
                    .image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/AplicationSecurity.png").build();
            categoryRepository.saveAll(List.of(networkSecurity, appSecurity));

// Security 하위 카테고리
            List<Category> securityChildren = List.of(
                    Category.builder().categoryName("SSL/TLS").parent(networkSecurity).level(3).build(),
                    Category.builder().categoryName("Firewall").parent(networkSecurity).level(3).build(),
                    Category.builder().categoryName("OWASP Top 10").parent(appSecurity).level(3).build(),
                    Category.builder().categoryName("SAST/DAST").parent(appSecurity).level(3).build()
            );
            categoryRepository.saveAll(securityChildren);


            System.out.println("Extended category data added");
        } else {
            System.out.println("Category data already exists");
        }
    }


    @Transactional
    public void initializeUserCategories(UserRepository userRepository, CategoryRepository categoryRepository, UserCategoryRepository userCategoryRepository) {
        if (userCategoryRepository.count() == 0) {
            List<UserCategory> userCategoryList = new ArrayList<>();

            // 사용자 불러오기
            User user1 = userRepository.findById(1L).orElseThrow(() -> new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));
            User user2 = userRepository.findById(2L).orElseThrow(() -> new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));


            // 상위 카테고리 선택 (사용자가 관심있는 분야)
            Category backEnd = categoryRepository.findById(1L).orElseThrow(()-> new CategoryException(CategoryErrorCode.CATEGORY_NOT_FOUND));
            Category frontEnd = categoryRepository.findById(2L).orElseThrow(()-> new CategoryException(CategoryErrorCode.CATEGORY_NOT_FOUND));
            Category infra = categoryRepository.findById(3L).orElseThrow(()-> new CategoryException(CategoryErrorCode.CATEGORY_NOT_FOUND));
            Category database = categoryRepository.findById(4L).orElseThrow(()-> new CategoryException(CategoryErrorCode.CATEGORY_NOT_FOUND));


            // 하위 카테고리 선택 (각 사용자가 관심있는 기술)
            List<Category> user1Interests = categoryRepository.findByParent(backEnd); // Back-end 관련 카테고리
            user1Interests.addAll(categoryRepository.findByParent(database)); // DB 관련 카테고리

            List<Category> user2Interests = categoryRepository.findByParent(frontEnd); // Front-end 관련 카테고리
            user2Interests.addAll(categoryRepository.findByParent(infra)); // Infra 관련 카테고리

            // UserCategory 매핑
            for (Category category : user1Interests) {
                userCategoryList.add(new UserCategory(user1, category));
            }

            for (Category category : user2Interests) {
                userCategoryList.add(new UserCategory(user2, category));
            }

            // 데이터 저장
            userCategoryRepository.saveAll(userCategoryList);
            System.out.println("Default UserCategory data added.");
        } else {
            System.out.println("UserCategory data already exists.");
        }
    }
    @Transactional
    public void initializeBoardType(BoardTypeRepository boardTypeRepository) {
        if (boardTypeRepository.count() == 0) {
            // 상위 BoardType 생성
            BoardType edu = BoardType.builder()
                    .name("edu")
                    .isLeaf(false)
                    .build();

            BoardType free = BoardType.builder()
                    .name("free")
                    .isLeaf(false)
                    .build();

            boardTypeRepository.save(edu);
            boardTypeRepository.save(free);

            // 하위 BoardType 생성
            List<BoardType> eduChildren = List.of(
                    BoardType.builder().name("legend").parent(edu).isLeaf(true).build(),
                    BoardType.builder().name("qna").parent(edu).isLeaf(true).build()
            );

            List<BoardType> freeChildren = List.of(
                    BoardType.builder().name("bulletin").parent(free).isLeaf(true).build(),
                    BoardType.builder().name("ssaguman").parent(free).isLeaf(true).build()
            );

            // 모든 BoardType 저장
            boardTypeRepository.saveAll(eduChildren);
            boardTypeRepository.saveAll(freeChildren);

            System.out.println("Default boardtype data added");
        } else {
            System.out.println("Default boardtype data already exists");
        }
    }

    @Transactional
    public void initializeAINews(AINewsRepository aiNewsRepository) {
        if (aiNewsRepository.count() == 0) {
            List<AINews> newsList = new ArrayList<>();
            LocalDateTime today = LocalDateTime.now();

            // 뉴스 데이터 (제목, URL)
            String[][] newsData = {
                    // 오늘 날짜 뉴스
                    {
                            "세종 생성형 인공지능 챗봇 시범 운영",
                            "https://www.yna.co.kr/view/AKR20241227132800063?input=1195m"
                    },
                    {
                            "국세청 내년부터 홈택스 싹 개편 신고서도 인공지능이 알아서 척척",
                            "https://news.mt.co.kr/mtview.php?no=2024123011050681481"
                    },
                    {
                            "사람과 비슷한 인공지능이 범죄에 연루된다면",
                            "https://www.seoul.co.kr/news/plan/science-diverse-story/2024/12/27/20241227500176?wlog_tag3=naver"
                    },
                    {
                            "내 재물운 어때? 은근 용하네 답답한 청년들의 상담사 된 인공지능",
                            "https://view.asiae.co.kr/article/2024122714492037903"
                    },
                    //내일 날짜 뉴스
                    {
                            "내년 서울 지하철 전 역에 AI CCTV",
                            "https://n.news.naver.com/mnews/article/023/0003885205?sid=102"
                    },
                    {
                            "오픈AI·MS 中 AI 딥시크 조사…데이터 무단 수집 가능성",
                            "https://n.news.naver.com/mnews/article/001/0015183436?sid=104"
                    },
                    {
                            "AI로 제조업 안전사고 예방한다…산업부, R&D 사업 공모",
                            "https://n.news.naver.com/mnews/article/001/0015183769?sid=105"
                    },
                    {
                            "2030년 AI 시장 1조달러로 성장 한국, 성공 가능성 높아",
                            "https://n.news.naver.com/mnews/article/001/0015183770?sid=105"
                    },
                    // 1일 전 뉴스
                    {
                            "바이오·AI·첨단로봇 특허심사 먼저 받는다…최대 2개월로 단축",
                            "https://n.news.naver.com/mnews/article/022/0004003985?sid=105"
                    },
                    {
                            "AI에 빠진 유통가 총수들 롯데 신동빈부터 현대百 정지선까지",
                            "https://n.news.naver.com/mnews/article/003/0013023462?sid=101"
                    },
                    {
                            "AI 활용 처지면 반도체도 조선도 끝 필사적인 재계",
                            "https://n.news.naver.com/mnews/article/421/0008029877?sid=101"
                    },
                    {
                            "통신·AI 체험 LGU+, 대학생 앰배서더 유쓰피릿 15기 모집",
                            "https://n.news.naver.com/mnews/article/003/0013023386?sid=105"
                    },
                    // 2일 전 뉴스
                    {
                            "인천시 민원, 이제 인공지능이 해결해드립니다",
                            "https://www.asiatoday.co.kr/kn/view.php?key=20250113010006059"
                    },
                    {
                            "나를 위해 인공지능(AI), 일상으로 나왔다",
                            "https://www.fnnews.com/news/202501121008300608"
                    },
                    {
                            "정확도 80% 인공지능으로 신소재 재료 물질 설계한다",
                            "https://www.yna.co.kr/view/AKR20250110102200063?input=1195m"
                    },
                    {
                            "단짠단짠 파스타 만들어 드릴게요 AI 셰프까지 나왔다",
                            "https://www.hankyung.com/article/2025011092041"
                    },
                    // 3일 전 뉴스
                    {
                            "개인정보위 '딥시크 보안상 우려 지속 제기…신중한 이용 당부'",
                            "https://news.nate.com/view/20250207000001"
                    },
                    {
                            "각국서 딥시크 금지?…'앱은 제한되더라도 오픈소스는 그대로'",
                            "https://news.nate.com/view/20250207000002"
                    },
                    {
                            "중국 AI의 역습, 제2·제3의 딥시크는 누구?",
                            "https://news.nate.com/view/20250207000003"
                    },
                    {
                            "SK텔레콤, CES 2025서 혁신적인 AI 미래기술 선보인다",
                            "https://www.hankyung.com/article/202412233343g"
                    },
                    // 4일 전 뉴스
                    {
                            "샘 올트먼 오픈 AI CEO 데이터센터용 AI 반도체 직접 개발",
                            "https://n.news.naver.com/mnews/article/009/0005437185"
                    },
                    {
                            "中 스타트업 딥시크의 AI 모델 개발비 5억 달러 이상 추정",
                            "https://n.news.naver.com/mnews/article/001/0015186368"
                    },
                    {
                            "2년뒤면 인간같은 AI, 韓 AI투자 속도 높여야[김현아의 IT세상읽기]",
                            "https://n.news.naver.com/mnews/hotissue/article/018/0005934572?type=series&cid=1084419"
                    },
                    {
                            "AI 혁신 넘어 QPU 시대 머지않아 도래",
                            "https://n.news.naver.com/mnews/article/037/0000035682"
                    },
                    // 5일 전 뉴스
                    {
                            "美 스탠퍼드·워싱턴대 50달러로 오픈AI 버금 AI 모델 개발",
                            "https://n.news.naver.com/mnews/article/001/0015199979?sid=104"
                    },
                    {
                            "무풍·제습 한번에 삼성 비스포크 AI 무풍콤보 갤러리 출시",
                            "https://n.news.naver.com/mnews/article/015/0005091556?sid=101"
                    },
                    {
                            "국정원, 딥시크 기술검증 정보수집 과한 데다 中 서버에 저장",
                            "https://n.news.naver.com/mnews/article/003/0013056074?sid=105"
                    },
                    {
                            "포항시, 생성형 AI 딥시크 선제적 차단 안전성 우려 해소 시까지",
                            "https://n.news.naver.com/mnews/article/022/0004009213?sid=102"
                    },
                    // 6일 전 뉴스
                    {
                            "챗GPT 대항마 그록3 17일 첫 선, 머스크 지구 가장 똑똑한 AI",
                            "https://n.news.naver.com/mnews/article/001/0015216042?sid=105"
                    },
                    {
                            "이세돌 9단, UNIST 특임교수 임용 AI 연구에 힘 보탠다",
                            "https://n.news.naver.com/mnews/article/003/0013069647?sid=105"
                    },
                    {
                            "美 빅테크, 아시아·중동에 AI 투자 확대 인재·인프라 늘려",
                            "https://n.news.naver.com/mnews/article/092/0002363347?sid=105"
                    },
                    {
                            "1등 AI 시험 AICE 합격 땐 학점따고 승진 가산점",
                            "https://n.news.naver.com/mnews/article/015/0005094825?sid=105"
                    }
            };

            // 뉴스 데이터 추가
            for (int i = 0; i < newsData.length; i++) {
                LocalDateTime newsDate = today.plusDays(i/4);
                AINews news = AINews.builder()
                        .title(newsData[i][0])
                        .url(newsData[i][1])
                        .createdAt(newsDate)
                        .build();
                newsList.add(news);
            }

            aiNewsRepository.saveAll(newsList);
            System.out.println("Default AINews data added");
        } else {
            System.out.println("Default AINews data already exists");
        }
    }

    @Transactional
    public void initializeLunch(LunchRepository lunchRepository) {
        if (lunchRepository.count() == 0) {
            List<Lunch> lunchList = new ArrayList<>();
            LocalDateTime today = LocalDateTime.now().withHour(12).withMinute(0).withSecond(0); // 정오 시간 설정

            // 점심 메뉴 데이터 (2개씩)
            String[][] menuData = {
                    {"김치찌개", "https://ssacle.s3.ap-northeast-2.amazonaws.com/image/food/kimchi.jpeg"},
                    {"된장찌개", "https://ssacle.s3.ap-northeast-2.amazonaws.com/image/food/soybean.jpeg"},
                    {"제육볶음", "https://ssacle.s3.ap-northeast-2.amazonaws.com/image/food/jeyuk.jpeg"},
                    {"닭갈비", "https://ssacle.s3.ap-northeast-2.amazonaws.com/image/food/dakgal.jpeg"},
                    {"비빔밥", "https://ssacle.s3.ap-northeast-2.amazonaws.com/image/food/bibimbab.jpeg"},
                    {"불고기", "https://ssacle.s3.ap-northeast-2.amazonaws.com/image/food/bulgogi.jpeg"},
                    {"칼국수", "https://ssacle.s3.ap-northeast-2.amazonaws.com/image/food/kalguksu.jpeg"},
                    {"짬뽕", "https://ssacle.s3.ap-northeast-2.amazonaws.com/image/food/jjamppong.jpeg"},
                    {"돈까스", "https://ssacle.s3.ap-northeast-2.amazonaws.com/image/food/donkatshu.jpeg"},
                    {"오므라이스", "https://ssacle.s3.ap-northeast-2.amazonaws.com/image/food/omurice.jpeg"},
                    {"떡볶이", "https://ssacle.s3.ap-northeast-2.amazonaws.com/image/food/tteokbokki.jpeg"},
                    {"라면", "https://ssacle.s3.ap-northeast-2.amazonaws.com/image/food/ramen.jpeg"},
                    {"초밥", "https://ssacle.s3.ap-northeast-2.amazonaws.com/image/food/sushi.jpeg"},
                    {"우동", "https://ssacle.s3.ap-northeast-2.amazonaws.com/image/food/udon.jpeg"}
            };

            for (int i = 0; i < 7; i++) { // 7일 동안 점심 생성
                LocalDateTime lunchDate = today.plusDays(i);

                // 하루에 두 가지 메뉴 제공
                for (int j = 0; j < 2; j++) {
                    Lunch lunch = Lunch.builder()
                            .day(lunchDate)
                            .menuName(menuData[i * 2 + j][0])
                            .imageUrl(menuData[i * 2 + j][1])
                            .build();
                    lunchList.add(lunch);
                }
            }

            lunchRepository.saveAll(lunchList);
            System.out.println("Lunch menu data added for the next 7 days.");
        } else {
            System.out.println("Lunch menu data already exists.");
        }
    }

    @Transactional
    public void initializeBoard(BoardRepository boardRepository, BoardTypeRepository boardTypeRepository, UserRepository userRepository) {
        if (boardRepository.count() == 0) {
            List<Board> boardList = new ArrayList<>();
            LocalDateTime now = LocalDateTime.now();

            // 예제 사용자 가져오기 (기본 사용자 사용)
            User user1 = userRepository.findById(1L).orElseThrow(() -> new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));
            User user2 = userRepository.findById(2L).orElseThrow(() -> new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));
            User user3 = userRepository.findById(3L).orElseThrow(() -> new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));
            User user4 = userRepository.findById(4L).orElseThrow(() -> new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));
            User user5 = userRepository.findById(5L).orElseThrow(() -> new CannotLoginException(LoginErrorCode.USER_NOT_FOUND));

            // BoardType 가져오기
            //BoardType eduType = boardTypeRepository.findByName("edu").orElseThrow(()->new BoardException(BoardErrorCode.BOARDTYPE_NOT_FOUND));
            //BoardType freeType = boardTypeRepository.findByName("free").orElseThrow(()->new BoardException(BoardErrorCode.BOARDTYPE_NOT_FOUND));
            BoardType legendType = boardTypeRepository.findByName("legend").orElseThrow(()->new BoardException(BoardErrorCode.BOARDTYPE_NOT_FOUND));
            BoardType qnaType = boardTypeRepository.findByName("qna").orElseThrow(()->new BoardException(BoardErrorCode.BOARDTYPE_NOT_FOUND));
            BoardType bulletinType = boardTypeRepository.findByName("bulletin").orElseThrow(()->new BoardException(BoardErrorCode.BOARDTYPE_NOT_FOUND));
            BoardType ssagumanType = boardTypeRepository.findByName("ssaguman").orElseThrow(()->new BoardException(BoardErrorCode.BOARDTYPE_NOT_FOUND));


            // Board 더미 데이터 생성 - user1
            boardList.add(Board.builder()
                    .user(user1)
                    .boardType(legendType)
                    .title("삼성 전자 면접 꿀팁")
                    .content("2024년 삼성 전자 MX 부분 최종 합격자입니다.\n해당년도 삼성 전자 면접 내용을 공유드려요.")
                    .tag("삼성,면접")
                    .createdAt(now.minusDays(1))
                    .updatedAt(now.minusDays(1))
                    .build());

            boardList.add(Board.builder()
                    .user(user1)
                    .boardType(legendType)
                    .title("삼성 전자 코딩 테스트 문제")
                    .content("2024년 삼성 전자 코딩 테스트 문제는 1문제가 나왔습니다.\n B형이 없던 저는 코딩 테스트를 응시했습니다.")
                    .tag("삼성,커테")
                    .createdAt(now.minusDays(40))
                    .updatedAt(now.minusDays(40))
                    .build());

            boardList.add(Board.builder()
                    .user(user1)
                    .boardType(legendType)
                    .title("삼성 자소서 문항")
                    .content("2024년 삼성 전자 MX 자소서 문항은 총 4개가 나왔습니다.\n 전년도와 비교해서 달라진 것이 없었습니다..")
                    .tag("삼성,자소서")
                    .createdAt(now.minusDays(60))
                    .updatedAt(now.minusDays(60))
                    .build());

            boardList.add(Board.builder()
                    .user(user2)
                    .boardType(legendType)
                    .title("12기 B형 3차 문제")
                    .content("B형 3트입니다.\nB형은 아시다시피 1문제에 4시간이 주어지며 최적화가 가장 큰 관건입니다.")
                    .tag("코테,B형")
                    .createdAt(now.minusDays(55))
                    .updatedAt(now.minusDays(55))
                    .build());

            boardList.add(Board.builder()
                    .user(user3)
                    .boardType(qnaType)
                    .title("JPA N+1 질문")
                    .content("Spring 고수분들, N+1 문제 해결에 있어 꿀팁이 있을까요.")
                    .tag("자유,소통")
                    .createdAt(now.minusDays(13))
                    .updatedAt(now.minusDays(13))
                    .build());

            boardList.add(Board.builder()
                    .user(user4)
                    .boardType(qnaType)
                    .title("axios vs fetch")
                    .content("프-백 연동시 fetch와 axios의 차이점에 대해서 알려주세요.")
                    .tag("React,Front-end")
                    .createdAt(now.minusDays(2))
                    .updatedAt(now.minusDays(2))
                    .build());

            // Board 더미 데이터 생성 - user2 (변경된 내용 적용)
            boardList.add(Board.builder()
                    .user(user4)
                    .boardType(qnaType)
                    .title("Spring Framework vs Spring Boot")
                    .content("Sprint Boot가 Spring Framework에 비해서 편하다고 하는데 어떤 점에서 편해요?")
                    .tag("Back-end,Spring")
                    .createdAt(now.minusDays(9))
                    .updatedAt(now.minusDays(9))
                    .build());

            boardList.add(Board.builder()
                    .user(user5)
                    .boardType(bulletinType)
                    .title("이달의 Top 3 게시물")
                    .content("이번 달 가장 많은 조회수를 기록한 게시글들을 소개합니다.")
                    .tag("명예,인기")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardList.add(Board.builder()
                    .user(user2)
                    .boardType(qnaType)
                    .title("JPA에서 N+1 문제 해결 방법")
                    .content("JPA에서 발생하는 N+1 문제를 어떻게 해결하는 것이 좋을까요?")
                    .tag("JPA,최적화,쿼리")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardList.add(Board.builder()
                    .user(user2)
                    .boardType(bulletinType)
                    .title("밥 친구 구해요")
                    .content("역삼 주변에 사시는 분들 중에서 같이 밥 먹을 사람?")
                    .tag("자유,유머")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardList.add(Board.builder()
                    .user(user3)
                    .boardType(bulletinType)
                    .title("카공 하기 좋은 카페")
                    .content("강남역 주변에 카공하기 좋은 카페 추천이요")
                    .tag("스터디,카페")
                    .createdAt(now.minusDays(10))
                    .updatedAt(now.minusDays(10))
                    .build());

            boardList.add(Board.builder()
                    .user(user4)
                    .boardType(ssagumanType)
                    .title("키보드 팔아요")
                    .content("독거미 키보드에요. 사용한지 2주 정도 됐는데 사용감이 있어서 절반 가격에 팔아요")
                    .tag("키보드,장비,할인")
                    .createdAt(now.minusDays(50))
                    .updatedAt(now.minusDays(50))
                    .build());

            boardList.add(Board.builder()
                    .user(user5)
                    .boardType(ssagumanType)
                    .title("포터블 모니터 사요")
                    .content("50만원 선에서 포터블 모니터 사려고 하는데 의향 있으신 분 ~로 MM 주세요 ㅎㅎ")
                    .tag("모니터,장비,컴퓨터")
                    .createdAt(now.minusDays(2))
                    .updatedAt(now.minusDays(2))
                    .build());
            // 추가 Board 더미 데이터 생성 - user1
            boardList.add(Board.builder()
                    .user(user1)
                    .boardType(bulletinType)
                    .title("Spring Security 기초")
                    .content("Spring Security를 활용한 인증 및 권한 부여 방법을 소개합니다.")
                    .tag("Spring,Security,인증")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardList.add(Board.builder()
                    .user(user4)
                    .boardType(qnaType)
                    .title("MySQL과 PostgreSQL 중 선택 고민")
                    .content("대규모 트래픽 환경에서 MySQL과 PostgreSQL 중 어떤 것을 선택하는 것이 좋을까요?")
                    .tag("MySQL,PostgreSQL,DB")
                    .createdAt(now.minusDays(6))
                    .updatedAt(now.minusDays(6))
                    .build());

            // 추가 Board 더미 데이터 생성 - user2
            boardList.add(Board.builder()
                    .user(user2)
                    .boardType(legendType)
                    .title("이달의 인기 오픈소스 프로젝트")
                    .content("이번 달 가장 많은 스타를 받은 오픈소스 프로젝트들을 소개합니다.")
                    .tag("오픈소스,인기,GitHub")
                    .createdAt(now.minusDays(14))
                    .updatedAt(now.minusDays(14))
                    .build());

            boardList.add(Board.builder()
                    .user(user5)
                    .boardType(qnaType)
                    .title("Kafka vs RabbitMQ 성능 비교")
                    .content("대량의 데이터를 처리할 때 Kafka와 RabbitMQ 중 어느 것이 더 유리한가요?")
                    .tag("Kafka,RabbitMQ,메시지큐")
                    .createdAt(now.minusDays(7))
                    .updatedAt(now.minusDays(7))
                    .build());

            boardList.add(Board.builder()
                    .user(user1)
                    .boardType(bulletinType)
                    .title("개발자로서의 성장 경험 공유")
                    .content("비전공자로 시작하여 개발자로 성장한 경험을 공유하고 싶습니다.")
                    .tag("개발자,성장,경험")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardRepository.saveAll(boardList);
            System.out.println("Default Board data added.");
        } else {
            System.out.println("Board data already exists.");
        }
    }
    @Transactional
    public void initializeSprints(SprintRepository sprintRepository,
                                  CategoryRepository categoryRepository,
                                  SprintCategoryRepository sprintCategoryRepository) {
        if (sprintRepository.count() == 0) {
            // Back-end 하위 카테고리
            Random random = new Random();
            LocalDateTime now = LocalDateTime.now();
            Category springBoot = categoryRepository.findByCategoryNameWithParent("Spring Boot").orElseThrow(CategoryNotExistException::new);
            List<Long> categoryIds = new ArrayList<>();
            categoryIds.add(springBoot.getId());
            Category parent = springBoot.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }

            LocalDateTime startAt = LocalDateTime.of(2025, 2, 20, 9, 0, 0);
            LocalDateTime endAt = LocalDateTime.of(2025, 2, 21, 18, 0, 0);
            Sprint sprint = SprintBuilder.builder()
                    .name("Spring Boot 감자 스터디 챌린지")
                    .basicDescription("Spring Boot 입문자들의 모임입니다.")
                    .detailDescription("기본적인 GetMapping, PostMapping 등과 어노테이션에 대한 학습을 목표로 합니다.")
                    .recommendedFor("Spring Boot가 처음이신분\nAnnotation에 대한 학습을 진행하고 싶으신 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(LocalDateTime.of(2025, 2, 21, 14, 0, 0))
                    .maxMembers(4)
                    .defaultTodos(generateSpringBootTodos(startAt))
                    .build();
            sprint.setStatus(0);
            sprintRepository.save(sprint);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                                .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint, sprintCategory));
            });

            Sprint testsprint = SprintBuilder.builder()
                    .name("Spring Boot 감자 스터디 챌린지2")
                    .basicDescription("Spring Boot 입문자들의 모임입니다.")
                    .detailDescription("기본적인 GetMapping, PostMapping 등과 어노테이션에 대한 학습을 목표로 합니다.")
                    .recommendedFor("Spring Boot가 처음이신분\nAnnotation에 대한 학습을 진행하고 싶으신 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(LocalDateTime.of(2025, 2, 21, 14, 0, 0))
                    .maxMembers(4)
                    .defaultTodos(generateSpringBootTodos(startAt))
                    .build();
            testsprint.setStatus(0);
            sprintRepository.save(testsprint);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(testsprint, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(springBoot.getId());
            parent = springBoot.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(6);
            endAt = now.plusDays(8);
            Sprint sprint1 = SprintBuilder.builder()
                    .name("Spring Boot 스레드 스프린트")
                    .basicDescription("Spring Boot 고수분 환영")
                    .detailDescription("단순히 Spring Boot를 쓰는 것이 아닌 자바 스레드와 비교를 통해 Spring Boot에 대한 깊은 이해를 목표로 합니다.")
                    .recommendedFor("Spring Boot 고수\n대규모 처리에 대한 관심도가 높으신 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint1.setStatus(0);
            sprintRepository.save(sprint1);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint1, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(springBoot.getId());
            parent = springBoot.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(3);
            endAt = now.plusDays(9);
            Sprint sprint2 = SprintBuilder.builder()
                    .name("Spring Boot에 대한 전반적인 이해")
                    .basicDescription("Spring Boot에 관심 많으신 분들 환영이요.")
                    .detailDescription("Spring JPA에 사용에 있어 N+1 어려움을 어떻게 효율적으로 해결할지 고민하기 위해 스프린트를 진행합니다.")
                    .recommendedFor("Spring Boot JPA에 관심 많으신 분\nLazyInitializationException에 고통 받으신 분\n Lazy와 Eager에 대해 깊이 알고 싶으신 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint2.setStatus(0);
            sprintRepository.save(sprint2);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint2, sprintCategory));
            });


            Category springMvc = categoryRepository.findByCategoryNameWithParent("Spring MVC").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(springMvc.getId());
            parent = springMvc.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(1);
            endAt = now.plusDays(7);
            Sprint sprint3 = SprintBuilder.builder()
                    .name("Spring MVC 패턴 관련 스프린트")
                    .basicDescription("Spring MVC 스프린트")
                    .detailDescription("Builder 패턴에 대해서 깊은 학습을 위해 스프린트를 만들었습니다.")
                    .recommendedFor("단순히 생성자를 사용하는 것이 아닌 Builder 패턴을 통한 범용성 넓은 생성에 관심을 갖춘 사람")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint3.setStatus(0);
            sprintRepository.save(sprint3);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint3, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(springMvc.getId());
            parent = springMvc.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(2);
            endAt = now.plusDays(4);
            Sprint sprint4 = SprintBuilder.builder()
                    .name("Spring MVC DTO를 위한 모임")
                    .basicDescription("DTO를 깊게 팔겁니다.")
                    .detailDescription("DTO를 왜 쓰는지, 파리미터가 1개인 경우 등 어떤 경우에 DTO를 적용해야하는지 학습")
                    .recommendedFor("Spring MVC 감자\nDTO에 대해 관심을 가지신 분\n지금껏 DTO 대신 Map을 사용하신 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint4.setStatus(0);
            sprintRepository.save(sprint4);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint4, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(springMvc.getId());
            parent = springMvc.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(6);
            endAt = now.plusDays(12);
            Sprint sprint5 = SprintBuilder.builder()
                    .name("MVC 구조에 대해 잘 모르시는 분")
                    .basicDescription("백엔드 감자분들 환영")
                    .detailDescription("기본적인 MVC 패턴도 잘모르신다. MVC 각각의 레이어에서 어떤 것을 주로 담당하는지 같이 알아가요.")
                    .recommendedFor("Spring을 활용한 백엔드 개발 입문자 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint5.setStatus(0);
            sprintRepository.save(sprint5);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint5, sprintCategory));
            });


            Category springSecurity = categoryRepository.findByCategoryNameWithParent("Spring Security").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(springSecurity.getId());
            parent = springSecurity.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(3);
            endAt = now.plusDays(5);
            Sprint sprint6 = SprintBuilder.builder()
                    .name("Spring Security에 대한 깊은 이해를 위한 스프린트")
                    .basicDescription("Spring Security 잘 알고 쓰자")
                    .detailDescription("Spring Security 설정에 있어 프로젝트에서 복붙이 아닌 전체적인 서비스를 이해하며 Config 파일을 짜자")
                    .recommendedFor("탄탄한 보안 구축에 흥미를 가지시는 분\nSpring Security에서 하는 일에 대한 깊은 이해를 목표로 하시는 분\nJWTFilter와 Spring Security에 대한 차이와 어떤 작용을 하는지 궁금하신 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint6.setStatus(0);
            sprintRepository.save(sprint6);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint6, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(springSecurity.getId());
            parent = springSecurity.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(7);
            endAt = now.plusDays(13);
            Sprint sprint7 = SprintBuilder.builder()
                    .name("Spring 고수 분들 들어와")
                    .basicDescription("Security 설정 알고 쓰자")
                    .detailDescription("대규모 서비스 분석을 통해 적절한 Securiy 설정법 학습")
                    .recommendedFor("Spring 고수\n현직자")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(5)
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint7.setStatus(0);
            sprintRepository.save(sprint7);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint7, sprintCategory));
            });


            Category djangoOrm = categoryRepository.findByCategoryNameWithParent("Django ORM").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(djangoOrm.getId());
            parent = djangoOrm.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(1);
            endAt = now.plusDays(7);
            Sprint sprint8 = SprintBuilder.builder()
                    .name("Python 입문자를 위한 스프린트")
                    .basicDescription("Python & Django 스프린트")
                    .detailDescription("Python을 이용한 백엔드 개발에 필요한 Django의 초기 세팅과 Python 기본 문법 학습을 위한 스프린트")
                    .recommendedFor("전공무관\nPython을 백엔드 개발에 흥미가 있는 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint8.setStatus(0);
            sprintRepository.save(sprint8);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint8, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(djangoOrm.getId());
            parent = djangoOrm.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(2);
            endAt = now.plusDays(4);
            Sprint sprint9 = SprintBuilder.builder()
                    .name("Django 고수 분들 환영")
                    .basicDescription("Django를 통한 대규모 처리")
                    .detailDescription("Django를 통한 대규모 데이터 분석에 목표로 가장 빠른 속도를 만들어 보세요")
                    .recommendedFor("Python을 통한 대규모 처리 경험자\n데이터 분야 관련 전공자\n현직자")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint9.setStatus(0);
            sprintRepository.save(sprint9);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint9, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(djangoOrm.getId());
            parent = djangoOrm.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(4);
            endAt = now.plusDays(10);
            Sprint sprint10 = SprintBuilder.builder()
                    .name("Django 1부터 100까지")
                    .basicDescription("Django 감자분들 환영")
                    .detailDescription("경쟁을 통해 성장하는 것을 목표로 합니다. 저도 잘 모르니 같이 공부하면서 성장해요")
                    .recommendedFor("Django 초보자\n같이 성장할 사람\n")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(7)
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint10.setStatus(0);
            sprintRepository.save(sprint10);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint10, sprintCategory));
            });


            Category djangoRestFramework = categoryRepository.findByCategoryNameWithParent("Django REST Framework").orElseThrow(CategoryNotExistException::new);

            Category expressJs = categoryRepository.findByCategoryNameWithParent("Express.js").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(expressJs.getId());
            parent = expressJs.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(4);
            endAt = now.plusDays(10);
            Sprint sprint11 = SprintBuilder.builder()
                    .name("ExpressJS 스프린트")
                    .basicDescription("비동기에 대해서 깊게 알아보자")
                    .detailDescription("Promise, async/await 등 비동기 처리에 대해 깊게 공부하고 싶은 사람들 환영")
                    .recommendedFor("Express를 활용한 프로젝트 경험자\n비동기 처리에 깊게 파고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt.minusHours(2))
                    .maxMembers(4)
                    .defaultTodos(generateExpressTodos(startAt))
                    .build();
            sprint11.setStatus(0);
            sprintRepository.save(sprint11);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint11, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(expressJs.getId());
            parent = expressJs.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(6);
            endAt = now.plusDays(12);
            Sprint sprint12 = SprintBuilder.builder()
                    .name("당근 마켓 클론 코디을 통한 스프린트")
                    .basicDescription("주어진 프런트 엔드에 맞춘 백엔드 설계")
                    .detailDescription("React로 구축된 당근 마켓 프런트 코드와 연동되는 백엔드 코드를 만들어보자")
                    .recommendedFor("Express를 통한 프로젝트 경험자\nNode.js 경험자")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(5)
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint12.setStatus(0);
            sprintRepository.save(sprint12);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint12, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(expressJs.getId());
            parent = expressJs.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(3);
            endAt = now.plusDays(9);
            Sprint sprint13 = SprintBuilder.builder()
                    .name("백엔드 초보자 환영")
                    .basicDescription("Express.js 세팅부터 기본적인 활용")
                    .detailDescription("기본적인 MVC 패턴도 잘모르신다. MVC 패턴을 좀 더 알고 싶으신 분들을 위한 스프린트")
                    .recommendedFor("백엔드 응애\nExpress 입문자")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint13.setStatus(0);
            sprintRepository.save(sprint13);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint13, sprintCategory));
            });


            Category nestJsModules = categoryRepository.findByCategoryNameWithParent("NestJS Modules").orElseThrow(CategoryNotExistException::new);
            Category flaskRestful = categoryRepository.findByCategoryNameWithParent("Flask RESTful").orElseThrow(CategoryNotExistException::new);
            Category eloquentOrm = categoryRepository.findByCategoryNameWithParent("Eloquent ORM").orElseThrow(CategoryNotExistException::new);

            // Front-end 하위 카테고리
            Category useState = categoryRepository.findByCategoryNameWithParent("useState").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(useState.getId());
            parent = useState.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = LocalDateTime.of(2025, 2, 24, 9, 0, 0);
            endAt = LocalDateTime.of(2025, 3, 2, 18, 0, 0);
            Sprint sprint14 = SprintBuilder.builder()
                    .name("React useState 기초 입문")
                    .basicDescription("React의 useState를 처음 배우는 분들을 위한 스프린트입니다.")
                    .detailDescription("React의 상태 관리 개념을 익히고, useState의 기본적인 사용법을 연습합니다.")
                    .recommendedFor("React 입문자\n컴포넌트 상태 관리 개념이 궁금하신 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(LocalDateTime.of(2025, 3, 2, 16, 0, 0)) // 변경된 announceAt 값 적용
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateReactTodos(startAt))
                    .build();
            sprint14.setStatus(0);
            sprintRepository.save(sprint14);

            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint14, sprintCategory));
            });

            Sprint testsprint14 = SprintBuilder.builder()
                    .name("React useState 기초 입문2")
                    .basicDescription("React의 useState를 처음 배우는 분들을 위한 스프린트입니다.")
                    .detailDescription("React의 상태 관리 개념을 익히고, useState의 기본적인 사용법을 연습합니다.")
                    .recommendedFor("React 입문자\n컴포넌트 상태 관리 개념이 궁금하신 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(LocalDateTime.of(2025, 3, 2, 16, 0, 0)) // 변경된 announceAt 값 적용
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateReactTodos(startAt))
                    .build();
            testsprint14.setStatus(0);
            sprintRepository.save(testsprint14);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(testsprint14, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(useState.getId());
            parent = useState.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(2);
            endAt = now.plusDays(4);
            Sprint sprint15  = SprintBuilder.builder()
                    .name("useState와 이벤트 핸들링")
                    .basicDescription("useState를 활용하여 사용자 입력을 처리하는 실습형 스프린트입니다.")
                    .detailDescription("입력 폼, 버튼 클릭, 값 변경 이벤트를 관리하는 방법을 학습합니다.")
                    .recommendedFor("React에서 사용자 인터랙션을 다루고 싶은 분\n입력 폼과 상태 관리에 대한 이해도를 높이고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint15.setStatus(0);
            sprintRepository.save(sprint15);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint15, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(useState.getId());
            parent = useState.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(6);
            endAt = now.plusDays(8);
            Sprint sprint16= SprintBuilder.builder()
                    .name("useState 최적화 및 성능 개선")
                    .basicDescription("useState의 성능 최적화와 불필요한 렌더링 방지를 학습하는 스프린트입니다.")
                    .detailDescription("React의 리렌더링 개념을 이해하고, useState와 useEffect를 함께 사용하여 최적화하는 방법을 익힙니다.")
                    .recommendedFor("React 성능 최적화에 관심 있는 개발자\n불필요한 렌더링을 최소화하는 방법을 배우고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint16.setStatus(0);
            sprintRepository.save(sprint16);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint16, sprintCategory));
            });


            Category useEffect = categoryRepository.findByCategoryNameWithParent("useEffect").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(useEffect.getId());
            parent = useEffect.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(5);
            endAt = now.plusDays(11);
            Sprint sprint17 = SprintBuilder.builder()
                    .name("useEffect 기본 개념과 활용")
                    .basicDescription("React의 useEffect를 처음 배우는 분들을 위한 스프린트입니다.")
                    .detailDescription("컴포넌트의 생명주기를 이해하고, useEffect의 의존성 배열을 활용하는 법을 익힙니다.")
                    .recommendedFor("React 입문자\nuseEffect의 동작 원리를 배우고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint17.setStatus(0);
            sprintRepository.save(sprint17);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint17, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(useEffect.getId());
            parent = useEffect.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(1);
            endAt = now.plusDays(7);
            Sprint sprint18 = SprintBuilder.builder()
                    .name("useEffect 최적화 및 성능 개선")
                    .basicDescription("불필요한 렌더링을 방지하고 성능을 최적화하는 useEffect 사용법을 학습하는 스프린트입니다.")
                    .detailDescription("React의 리렌더링 문제를 해결하는 법을 배우고, useEffect를 효율적으로 활용하는 전략을 익힙니다.")
                    .recommendedFor("React 성능 최적화에 관심 있는 개발자\n렌더링 최적화와 useEffect의 깊은 이해를 원하는 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(5)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint18.setStatus(0);
            sprintRepository.save(sprint18);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint18, sprintCategory));
            });


            Category reactContextApi = categoryRepository.findByCategoryNameWithParent("React Context API").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(reactContextApi.getId());
            parent = reactContextApi.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(1);
            endAt = now.plusDays(3);
            Sprint sprint19 = SprintBuilder.builder()
                    .name("React Context API를 활용한 전역 상태 관리")
                    .basicDescription("Redux 없이 전역 상태를 쉽게 관리하는 방법을 배웁니다.")
                    .detailDescription("useContext와 Context Provider를 활용하여 상태를 전역으로 공유하는 패턴을 학습합니다.")
                    .recommendedFor("Redux 없이 상태 관리를 원하는 React 개발자\n컴포넌트 간 props drilling 문제를 해결하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint19.setStatus(0);
            sprintRepository.save(sprint19);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint19, sprintCategory));
            });


            Category vueRouter = categoryRepository.findByCategoryNameWithParent("Vue Router").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(vueRouter.getId());
            parent = vueRouter.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(4);
            endAt = now.plusDays(10);
            Sprint sprint20 = SprintBuilder.builder()
                    .name("Vue Router 기초 학습")
                    .basicDescription("Vue Router의 기본 개념과 라우팅 설정 방법을 익히는 스프린트입니다.")
                    .detailDescription("Vue에서 페이지를 이동하는 방법과, `router-view`, `router-link`를 활용하는 기초적인 내용을 학습합니다.")
                    .recommendedFor("Vue.js를 처음 배우는 개발자\nSPA(단일 페이지 애플리케이션) 라우팅 개념을 이해하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint20.setStatus(0);
            sprintRepository.save(sprint20);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint20, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(vueRouter.getId());
            parent = vueRouter.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(3);
            endAt = now.plusDays(9);
            Sprint sprint21 = SprintBuilder.builder()
                    .name("Vue Router와 네비게이션 가드")
                    .basicDescription("페이지 이동 시 인증 및 권한을 관리하는 방법을 학습하는 스프린트입니다.")
                    .detailDescription("네비게이션 가드를 사용하여 로그인 여부에 따라 접근을 제한하는 방법을 실습합니다.")
                    .recommendedFor("Vue 기반 인증 시스템을 구축하고 싶은 개발자\n라우트 가드를 통해 접근 제어를 구현하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt.minusHours(3))
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateVueTodos(startAt))
                    .build();
            sprint21.setStatus(0);
            sprintRepository.save(sprint21);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint21, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(vueRouter.getId());
            parent = vueRouter.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(1);
            endAt = now.plusDays(3);
            Sprint sprint22 =  SprintBuilder.builder()
                    .name("Vue Router 동적 라우팅과 파라미터 활용")
                    .basicDescription("Vue Router에서 동적 라우트를 생성하고 URL 파라미터를 다루는 방법을 학습하는 스프린트입니다.")
                    .detailDescription("`:id`와 같은 동적 세그먼트를 사용하여, 동적인 데이터 기반 페이지를 구현하는 방법을 익힙니다.")
                    .recommendedFor("Vue Router를 활용하여 동적 페이지를 만들고 싶은 개발자\nURL 매개변수를 활용하여 데이터를 동적으로 불러오고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint22.setStatus(0);
            sprintRepository.save(sprint22);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint22, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(vueRouter.getId());
            parent = vueRouter.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(7);
            endAt = now.plusDays(13);
            Sprint sprint23 = SprintBuilder.builder()
                    .name("Vue Router 트랜지션 및 애니메이션 효과 적용")
                    .basicDescription("페이지 이동 시 자연스러운 애니메이션을 적용하는 방법을 학습하는 스프린트입니다.")
                    .detailDescription("Vue의 `transition` 컴포넌트를 활용하여 부드러운 화면 전환 효과를 적용하는 방법을 실습합니다.")
                    .recommendedFor("Vue 프로젝트에서 UX 개선을 위해 애니메이션을 적용하고 싶은 개발자\n페이지 전환 시 자연스러운 화면 이동 효과를 만들고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(5)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint23.setStatus(0);
            sprintRepository.save(sprint23);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint23, sprintCategory));
            });


            Category vuex = categoryRepository.findByCategoryNameWithParent("Vuex").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(vuex.getId());
            parent = vuex.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(4);
            endAt = now.plusDays(6);
            Sprint sprint24 = SprintBuilder.builder()
                    .name("Vuex를 활용한 상태 관리 최적화")
                    .basicDescription("Vuex를 활용하여 전역 상태를 효율적으로 관리하는 방법을 배웁니다.")
                    .detailDescription("Vue의 중앙 집중식 상태 관리 패턴을 이해하고, `state`, `getters`, `mutations`, `actions`의 개념을 학습합니다.")
                    .recommendedFor("Vue 애플리케이션의 상태 관리를 체계적으로 하고 싶은 개발자\n컴포넌트 간 복잡한 데이터 흐름을 정리하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(7)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint24.setStatus(0);
            sprintRepository.save(sprint24);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint24, sprintCategory));
            });


            Category angularDi = categoryRepository.findByCategoryNameWithParent("Angular DI").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(angularDi.getId());
            parent = angularDi.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(1);
            endAt = now.plusDays(7);
            Sprint sprint25 = SprintBuilder.builder()
                    .name("Angular DI 기초와 서비스 주입")
                    .basicDescription("Angular의 DI(Dependency Injection) 개념과 서비스 주입 방법을 학습하는 스프린트입니다.")
                    .detailDescription("DI가 Angular에서 어떻게 동작하는지 배우고, `@Injectable` 및 `providers`의 역할을 학습합니다.")
                    .recommendedFor("Angular 개발을 시작하는 초급자\n서비스와 컴포넌트 간 데이터 공유를 원하시는 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint25.setStatus(0);
            sprintRepository.save(sprint25);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint25, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(angularDi.getId());
            parent = angularDi.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(6);
            endAt = now.plusDays(12);
            Sprint sprint26 = SprintBuilder.builder()
                    .name("Angular DI를 활용한 모듈화와 테스트")
                    .basicDescription("DI를 활용한 모듈화와 서비스 주입의 최적화 방법을 배우는 스프린트입니다.")
                    .detailDescription("의존성 주입을 통해 유지보수하기 쉬운 코드를 작성하고, 유닛 테스트에서 `Mock` 서비스를 사용하는 법을 학습합니다.")
                    .recommendedFor("Angular 애플리케이션의 유지보수를 쉽게 하고 싶은 개발자\n테스트 환경에서 DI를 활용하는 방법을 배우고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint26.setStatus(0);
            sprintRepository.save(sprint26);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint26, sprintCategory));
            });


            Category svelteStores = categoryRepository.findByCategoryNameWithParent("Svelte Stores").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(svelteStores.getId());
            parent = svelteStores.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(2);
            endAt = now.plusDays(4);
            Sprint sprint27 = SprintBuilder.builder()
                    .name("Svelte Stores 기초 학습")
                    .basicDescription("Svelte의 상태 관리 시스템인 Stores의 개념과 기본 사용법을 익히는 스프린트입니다.")
                    .detailDescription("Svelte의 `writable`, `readable`, `derived` Stores의 개념과 활용법을 배웁니다.")
                    .recommendedFor("Svelte를 처음 접하는 개발자\n컴포넌트 간 상태 관리를 배우고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint27.setStatus(0);
            sprintRepository.save(sprint27);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint27, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(svelteStores.getId());
            parent = svelteStores.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(5);
            endAt = now.plusDays(11);
            Sprint sprint28 = SprintBuilder.builder()
                    .name("Svelte Stores를 활용한 전역 상태 관리")
                    .basicDescription("Svelte Stores를 이용해 전역 상태를 관리하는 방법을 학습하는 스프린트입니다.")
                    .detailDescription("Svelte의 `writable`과 `derived` Stores를 활용하여 전역 상태를 효율적으로 관리하고, 반응성을 최적화하는 방법을 배웁니다.")
                    .recommendedFor("Svelte 애플리케이션에서 전역 상태 관리가 필요한 개발자\n반응형 상태 관리 패턴을 학습하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(8)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint28.setStatus(0);
            sprintRepository.save(sprint28);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint28, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(svelteStores.getId());
            parent = svelteStores.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(9);
            endAt = now.plusDays(11);
            Sprint sprint29 = SprintBuilder.builder()
                    .name("Svelte Stores를 활용한 비동기 데이터 관리")
                    .basicDescription("Svelte의 Stores를 활용하여 API 데이터를 효율적으로 관리하는 방법을 배우는 스프린트입니다.")
                    .detailDescription("Svelte의 `readable`과 `derived` Stores를 활용하여 비동기 데이터 요청을 최적화하고, API 응답을 효율적으로 관리하는 방법을 익힙니다.")
                    .recommendedFor("Svelte에서 API 데이터를 다루는 방법을 배우고 싶은 개발자\n비동기 상태 관리를 최적화하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint29.setStatus(0);
            sprintRepository.save(sprint29);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint29, sprintCategory));
            });

            // Database 하위 카테고리
            Category indexing = categoryRepository.findByCategoryNameWithParent("Indexing").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(indexing.getId());
            parent = indexing.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(5);
            endAt = now.plusDays(11);
            Sprint sprint30 = SprintBuilder.builder()
                    .name("데이터베이스 인덱싱 기초")
                    .basicDescription("인덱스의 개념과 기본적인 활용법을 학습하는 스프린트입니다.")
                    .detailDescription("B-Tree와 Hash Index의 차이를 이해하고, 인덱스가 쿼리 성능에 미치는 영향을 실습합니다.")
                    .recommendedFor("데이터베이스 성능 최적화에 관심 있는 개발자\nSQL 쿼리 실행 속도를 개선하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(5 + random.nextInt(5))  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint30.setStatus(0);
            sprintRepository.save(sprint30);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint30, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(indexing.getId());
            parent = indexing.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(1);
            endAt = now.plusDays(3);
            Sprint sprint31 = SprintBuilder.builder()
                    .name("고급 인덱스 전략 및 성능 튜닝")
                    .basicDescription("복합 인덱스와 부분 인덱스를 활용한 성능 최적화 방법을 배우는 스프린트입니다.")
                    .detailDescription("커버링 인덱스, 클러스터드 인덱스, 파티셔닝 기법을 사용하여 데이터베이스 성능을 극대화하는 방법을 실습합니다.")
                    .recommendedFor("SQL 실행 계획을 분석하고 쿼리 성능을 최적화하고 싶은 개발자\n복합 인덱스를 활용하여 성능을 개선하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint31.setStatus(0);
            sprintRepository.save(sprint31);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint31, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(indexing.getId());
            parent = indexing.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(14);
            endAt = now.plusDays(16);
            Sprint sprint32 = SprintBuilder.builder()
                    .name("인덱스와 락 충돌 분석")
                    .basicDescription("데이터베이스의 락과 인덱스가 어떻게 상호작용하는지 학습하는 스프린트입니다.")
                    .detailDescription("인덱스가 검색 성능을 향상시키지만, 동시에 락 충돌을 유발할 수도 있는 이유를 분석하고, Deadlock을 최소화하는 전략을 학습합니다.")
                    .recommendedFor("데이터베이스 동시성 문제를 이해하고 싶은 개발자\nDeadlock을 예방하고 시스템 성능을 최적화하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint32.setStatus(0);
            sprintRepository.save(sprint32);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint32, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(indexing.getId());
            parent = indexing.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = LocalDateTime.of(2025, 2, 20, 9, 0, 0);
            endAt = LocalDateTime.of(2025, 2, 22, 18, 0, 0);
            Sprint sprint33 = SprintBuilder.builder()
                    .name("인덱스와 조인 최적화")
                    .basicDescription("인덱스를 활용하여 SQL 조인 성능을 최적화하는 방법을 배우는 스프린트입니다.")
                    .detailDescription("Nested Loop Join, Hash Join, Merge Join 등 다양한 조인 기법을 학습하고, 인덱스와 결합하여 최적의 쿼리 성능을 만드는 전략을 익힙니다.")
                    .recommendedFor("대량 데이터 조인을 빠르게 처리하고 싶은 개발자\nSQL 조인 최적화를 통해 시스템 성능을 개선하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(LocalDateTime.of(2025, 2, 22, 16, 0, 0))
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateIndexTodos(startAt))
                    .build();
            sprint33.setStatus(0);
            sprintRepository.save(sprint33);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint33, sprintCategory));
            });

            Sprint testsprint33 = SprintBuilder.builder()
                    .name("인덱스와 조인 최적화2")
                    .basicDescription("인덱스를 활용하여 SQL 조인 성능을 최적화하는 방법을 배우는 스프린트입니다.")
                    .detailDescription("Nested Loop Join, Hash Join, Merge Join 등 다양한 조인 기법을 학습하고, 인덱스와 결합하여 최적의 쿼리 성능을 만드는 전략을 익힙니다.")
                    .recommendedFor("대량 데이터 조인을 빠르게 처리하고 싶은 개발자\nSQL 조인 최적화를 통해 시스템 성능을 개선하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(LocalDateTime.of(2025, 2, 22, 16, 0, 0))
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateIndexTodos(startAt))
                    .build();
            testsprint33.setStatus(0);
            sprintRepository.save(testsprint33);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(testsprint33, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(indexing.getId());
            parent = indexing.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(1);
            endAt = now.plusDays(3);
            Sprint sprint34 = SprintBuilder.builder()
                    .name("실제 서비스에서 인덱스 활용 사례 분석")
                    .basicDescription("대규모 트래픽을 처리하는 실전 서비스에서 인덱스를 최적화하는 방법을 배우는 스프린트입니다.")
                    .detailDescription("검색 엔진, 금융 시스템, 이커머스 사이트에서 사용되는 인덱스 설계 패턴을 분석하고, 최적의 인덱스 설계를 실습합니다.")
                    .recommendedFor("대규모 서비스의 데이터베이스 최적화 사례를 배우고 싶은 개발자\n실전 환경에서 성능 최적화 전략을 적용하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint34.setStatus(0);
            sprintRepository.save(sprint34);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint34, sprintCategory));
            });


            Category acid = categoryRepository.findByCategoryNameWithParent("ACID").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(acid.getId());
            parent = acid.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(1);
            endAt = now.plusDays(7);
            Sprint sprint35 = SprintBuilder.builder()
                    .name("트랜잭션과 ACID 개념 학습")
                    .basicDescription("트랜잭션의 개념과 ACID 원칙을 학습하는 스프린트입니다.")
                    .detailDescription("Atomicity(원자성), Consistency(일관성), Isolation(고립성), Durability(지속성)의 개념을 배우고, 트랜잭션 관리의 중요성을 이해합니다.")
                    .recommendedFor("데이터 정합성을 보장하고 싶은 개발자\n트랜잭션 관리 개념을 명확히 이해하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint35.setStatus(0);
            sprintRepository.save(sprint35);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint35, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(acid.getId());
            parent = acid.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(5);
            endAt = now.plusDays(11);
            Sprint sprint36 = SprintBuilder.builder()
                    .name("실전 트랜잭션 관리 및 장애 대응")
                    .basicDescription("트랜잭션의 일관성과 복구 전략을 실전 사례로 배우는 스프린트입니다.")
                    .detailDescription("Deadlock(교착 상태) 해결 방법, 트랜잭션 격리 수준 조정, 데이터 정합성을 유지하기 위한 장애 대응 전략을 학습합니다.")
                    .recommendedFor("트랜잭션을 안정적으로 운영하고 싶은 개발자\n실무에서 발생하는 트랜잭션 충돌과 장애를 분석하고 해결하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint36.setStatus(0);
            sprintRepository.save(sprint36);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint36, sprintCategory));
            });


            Category sharding = categoryRepository.findByCategoryNameWithParent("Sharding").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(sharding.getId());
            parent = sharding.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(3);
            endAt = now.plusDays(9);
            Sprint sprint37 = SprintBuilder.builder()
                    .name("Sharding 기초 개념 학습")
                    .basicDescription("Sharding(샤딩)의 개념과 기본적인 적용 방법을 학습하는 스프린트입니다.")
                    .detailDescription("Sharding이 필요한 이유와 `수평 샤딩` vs `수직 샤딩`의 차이를 배우고, 기본적인 샤딩 전략을 익힙니다.")
                    .recommendedFor("대규모 데이터를 효율적으로 관리하고 싶은 개발자\nSharding을 처음 접하는 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(5)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint37.setStatus(0);
            sprintRepository.save(sprint37);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint37, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(sharding.getId());
            parent = sharding.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(6);
            endAt = now.plusDays(12);
            Sprint sprint38 = SprintBuilder.builder()
                    .name("Sharding 아키텍처 설계 및 성능 최적화")
                    .basicDescription("Sharding을 활용하여 분산 데이터베이스를 설계하고 성능을 최적화하는 스프린트입니다.")
                    .detailDescription("해시 기반 Sharding, 레인지 기반 Sharding, 동적 Sharding 방법을 배우고, 실제 프로젝트에서 성능을 개선하는 전략을 실습합니다.")
                    .recommendedFor("대용량 트래픽을 처리할 데이터베이스 설계에 관심 있는 개발자\nSharding 성능 최적화 전략을 익히고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint38.setStatus(0);
            sprintRepository.save(sprint38);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint38, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(sharding.getId());
            parent = sharding.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(6);
            endAt = now.plusDays(8);
            Sprint sprint39 = SprintBuilder.builder()
                    .name("실전 프로젝트에서 Sharding 적용 사례 연구")
                    .basicDescription("대규모 서비스에서 Sharding이 실제로 어떻게 적용되는지 분석하는 스프린트입니다.")
                    .detailDescription("금융, 이커머스, 게임 서버 등의 서비스에서 Sharding 적용 사례를 연구하고, MySQL, PostgreSQL, MongoDB 등의 분산 데이터베이스 활용법을 실습합니다.")
                    .recommendedFor("실제 서비스에서 Sharding을 적용한 사례를 분석하고 싶은 개발자\nSharding을 대규모 시스템에 도입하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(5 + random.nextInt(5))  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint39.setStatus(0);
            sprintRepository.save(sprint39);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint39, sprintCategory));
            });


            Category cacheStrategies = categoryRepository.findByCategoryNameWithParent("Cache Strategies").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(cacheStrategies.getId());
            parent = cacheStrategies.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(1);
            endAt = now.plusDays(3);
            Sprint sprint40 = SprintBuilder.builder()
                    .name("캐시 전략과 성능 최적화")
                    .basicDescription("효율적인 캐시 전략을 활용하여 애플리케이션 성능을 최적화하는 스프린트입니다.")
                    .detailDescription("LRU, LFU, FIFO 등의 캐싱 알고리즘을 비교하고, Redis, Memcached를 활용하여 실전 환경에서의 캐싱 적용법을 학습합니다.")
                    .recommendedFor("대규모 트래픽을 처리하는 개발자\n애플리케이션의 응답 속도를 개선하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(5)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint40.setStatus(0);
            sprintRepository.save(sprint40);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint40, sprintCategory));
            });


            // Mobile 하위 카테고리
            Category jetpackCompose = categoryRepository.findByCategoryNameWithParent("Jetpack Compose").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(jetpackCompose.getId());
            parent = jetpackCompose.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(1);
            endAt = now.plusDays(7);
            Sprint sprint41 = SprintBuilder.builder()
                    .name("Jetpack Compose 기초 학습")
                    .basicDescription("Jetpack Compose의 기초 개념과 UI 구성 방법을 학습하는 스프린트입니다.")
                    .detailDescription("Composable 함수의 개념, 상태 관리, Layout 및 Modifier의 역할을 배우고 실습합니다.")
                    .recommendedFor("Android UI 개발을 Jetpack Compose로 시작하려는 개발자\nXML 기반 UI에서 Compose로 전환을 고민하는 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint41.setStatus(0);
            sprintRepository.save(sprint41);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint41, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(jetpackCompose.getId());
            parent = jetpackCompose.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(3);
            endAt = now.plusDays(5);
            Sprint sprint42 = SprintBuilder.builder()
                    .name("안드로이드 UI, XML에서 Compose로 탈출!")
                    .basicDescription("Jetpack Compose로 UI 개발 방식을 혁신하는 스프린트입니다.")
                    .detailDescription("XML 기반 UI의 한계를 극복하고 `Composable` 함수, `State` 관리, `Modifier` 활용법을 익혀 빠르고 유연한 UI 개발을 경험합니다.")
                    .recommendedFor("Jetpack Compose를 처음 배우는 개발자\nXML에서 Compose로 전환을 고려하는 개발자")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint42.setStatus(0);
            sprintRepository.save(sprint42);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint42, sprintCategory));
            });


            Category kotlinCoroutines = categoryRepository.findByCategoryNameWithParent("Kotlin Coroutines").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(kotlinCoroutines.getId());
            parent = kotlinCoroutines.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(4);
            endAt = now.plusDays(10);
            Sprint sprint43 = SprintBuilder.builder()
                    .name("안드로이드 개발자를 위한 코루틴 첫걸음")
                    .basicDescription("Kotlin Coroutines의 기본 개념과 비동기 프로그래밍을 학습하는 스프린트입니다.")
                    .detailDescription("`suspend function`, `CoroutineScope`, `Job`, `Dispatcher` 개념을 배우고, 간단한 예제를 통해 비동기 호출을 구현합니다.")
                    .recommendedFor("Kotlin을 사용하지만 아직 코루틴을 제대로 활용하지 못한 개발자\n안드로이드에서 비동기 처리를 효율적으로 하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint43.setStatus(0);
            sprintRepository.save(sprint43);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint43, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(kotlinCoroutines.getId());
            parent = kotlinCoroutines.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(4);
            endAt = now.plusDays(10);
            Sprint sprint44= SprintBuilder.builder()
                    .name("Flow로 배우는 리액티브 프로그래밍")
                    .basicDescription("`Flow`를 활용하여 데이터 스트림을 관리하는 방법을 학습하는 스프린트입니다.")
                    .detailDescription("`StateFlow`, `SharedFlow`, `collectLatest` 등을 활용하여 실시간 데이터 흐름을 제어하는 법을 배우고, RxJava와의 차이점도 비교합니다.")
                    .recommendedFor("Kotlin의 비동기 스트림을 활용한 데이터 흐름 관리를 배우고 싶은 개발자\nRxJava에서 Coroutines Flow로 전환하려는 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint44.setStatus(0);
            sprintRepository.save(sprint44);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint44, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(kotlinCoroutines.getId());
            parent = kotlinCoroutines.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(2);
            endAt = now.plusDays(8);
            Sprint sprint45= SprintBuilder.builder()
                    .name("코루틴과 Retrofit – 네트워크 비동기 처리 완전 정복")
                    .basicDescription("Kotlin Coroutines를 활용한 네트워크 통신 최적화 방법을 배우는 스프린트입니다.")
                    .detailDescription("`Retrofit`과 `CoroutineScope`를 조합하여 네트워크 요청을 관리하고, `try-catch`, `timeout`, `retry` 기법을 활용하여 안정적인 네트워크 처리를 구현합니다.")
                    .recommendedFor("안드로이드에서 네트워크 요청을 최적화하고 싶은 개발자\n비동기 API 호출을 더 효율적으로 관리하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(5)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint45.setStatus(0);
            sprintRepository.save(sprint45);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint45, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(kotlinCoroutines.getId());
            parent = kotlinCoroutines.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(4);
            endAt = now.plusDays(6);
            Sprint sprint46= SprintBuilder.builder()
                    .name("성능 최적화를 위한 코루틴 심화 – Structured Concurrency")
                    .basicDescription("Kotlin Coroutines의 `Structured Concurrency`를 활용하여 성능을 최적화하는 방법을 배우는 스프린트입니다.")
                    .detailDescription("`SupervisorJob`, `withContext`, `async-await`, `coroutineScope`의 개념을 배우고, 여러 개의 비동기 작업을 효율적으로 관리하는 방법을 학습합니다.")
                    .recommendedFor("대규모 애플리케이션에서 코루틴을 제대로 활용하고 싶은 개발자\n동시성 프로그래밍을 최적화하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(7)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint46.setStatus(0);
            sprintRepository.save(sprint46);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint46, sprintCategory));
            });


            Category swiftUi = categoryRepository.findByCategoryNameWithParent("SwiftUI").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(swiftUi.getId());
            parent = swiftUi.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(5);
            endAt = now.plusDays(11);
            Sprint sprint47= SprintBuilder.builder()
                    .name("UIKit은 이제 그만! SwiftUI로 UI 개발 시작하기")
                    .basicDescription("SwiftUI의 핵심 개념을 배우고, UI를 선언형 방식으로 개발하는 스프린트입니다.")
                    .detailDescription("`View`, `State`, `Binding`, `ObservableObject` 개념을 익히고, UIKit과의 차이점을 비교하며 SwiftUI 기반 UI 개발을 실습합니다.")
                    .recommendedFor("UIKit을 사용하다 SwiftUI로 전환하고 싶은 개발자\nSwiftUI의 선언형 UI 개발 방식에 익숙해지고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint47.setStatus(0);
            sprintRepository.save(sprint47);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint47, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(swiftUi.getId());
            parent = swiftUi.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(4);
            endAt = now.plusDays(6);
            Sprint sprint48= SprintBuilder.builder()
                    .name("부드러운 애니메이션! SwiftUI로 다이나믹한 UI 만들기")
                    .basicDescription("SwiftUI의 애니메이션 기능을 활용하여 직관적이고 부드러운 UI를 만드는 스프린트입니다.")
                    .detailDescription("`withAnimation`, `implicit & explicit animations`, `matchedGeometryEffect`, `spring animation` 등을 학습하고, 실제 앱에서 동적인 UI를 구현하는 법을 실습합니다.")
                    .recommendedFor("SwiftUI에서 자연스러운 애니메이션을 구현하고 싶은 개발자\n유저 인터랙션을 강조한 UI를 만들고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint48.setStatus(0);
            sprintRepository.save(sprint48);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint48, sprintCategory));
            });


            Category combine = categoryRepository.findByCategoryNameWithParent("Combine").orElseThrow(CategoryNotExistException::new);

            // DevOps 하위 카테고리
            Category jenkins = categoryRepository.findByCategoryNameWithParent("Jenkins").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(jenkins.getId());
            parent = jenkins.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(4);
            endAt = now.plusDays(10);
            Sprint sprint49 = SprintBuilder.builder()
                    .name("Jenkins 기본기 다지기 - CI/CD의 첫걸음")
                    .basicDescription("Jenkins를 활용한 CI/CD 파이프라인 기본 개념을 학습하는 스프린트입니다.")
                    .detailDescription("Jenkins 설치 및 설정, 기본적인 `Pipeline` 작성법, 빌드 및 배포 자동화를 배우고 간단한 프로젝트에 적용해 봅니다.")
                    .recommendedFor("CI/CD를 처음 배우는 개발자\nJenkins를 활용한 자동화 배포를 익히고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint49.setStatus(0);
            sprintRepository.save(sprint49);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint49, sprintCategory));
            });


            categoryIds = new ArrayList<>();
            categoryIds.add(jenkins.getId());
            parent = jenkins.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.minusDays(1);
            endAt = now.plusDays(1);
            Sprint sprint50 = SprintBuilder.builder()
                    .name("Jenkins와 Docker로 완전 자동화 배포하기")
                    .basicDescription("Jenkins와 Docker를 결합하여 컨테이너 기반 CI/CD 자동화를 학습하는 스프린트입니다.")
                    .detailDescription("Docker 컨테이너에서 Jenkins 실행, `Jenkinsfile` 작성법, `Multi-stage Build`, `Docker Compose`를 활용한 배포 자동화를 실습합니다.")
                    .recommendedFor("Docker와 CI/CD 자동화를 함께 배우고 싶은 개발자\n컨테이너 기반 배포를 익히고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt.plusHours(1))
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateDockerJenkinsTodos(startAt))
                    .build();
            sprint50.setStatus(1);
            sprintRepository.save(sprint50);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint50, sprintCategory));
            });



            categoryIds = new ArrayList<>();
            categoryIds.add(jenkins.getId());
            parent = jenkins.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(5);
            endAt = now.plusDays(11);
            Sprint sprint51 = SprintBuilder.builder()
                    .name("Jenkins 최적화 - 빠르고 안전한 배포 환경 만들기")
                    .basicDescription("Jenkins를 최적화하여 CI/CD 속도를 높이고, 보안을 강화하는 방법을 학습하는 스프린트입니다.")
                    .detailDescription("병렬 빌드 실행, `Shared Libraries` 활용, `Blue-Green Deployment`, `Rolling Update`, 보안 플러그인 활용법을 실습합니다.")
                    .recommendedFor("Jenkins를 효율적으로 운영하고 싶은 DevOps 엔지니어\n대규모 프로젝트에서 CI/CD 성능을 개선하고 싶은 개발자")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint51.setStatus(0);
            sprintRepository.save(sprint51);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint51, sprintCategory));
            });


            Category githubActions = categoryRepository.findByCategoryNameWithParent("GitHub Actions").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(githubActions.getId());
            parent = githubActions.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(12);
            endAt = now.plusDays(14);
            Sprint sprint52 = SprintBuilder.builder()
                    .name("GitHub Actions 기초 - CI/CD 첫걸음")
                    .basicDescription("GitHub Actions를 활용하여 CI/CD를 자동화하는 기초 개념을 학습하는 스프린트입니다.")
                    .detailDescription("`Workflow`, `Job`, `Step`, `Runner`의 개념을 익히고, 간단한 `.github/workflows` 파일을 작성하여 CI/CD 자동화 환경을 구축해봅니다.")
                    .recommendedFor("GitHub Actions를 처음 접하는 개발자\nCI/CD 자동화를 시작하려는 개발자")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint52.setStatus(0);
            sprintRepository.save(sprint52);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint52, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(githubActions.getId());
            parent = githubActions.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(8);
            endAt = now.plusDays(14);
            Sprint sprint53 = SprintBuilder.builder()
                    .name("GitHub Actions와 Docker - 컨테이너 기반 배포 자동화")
                    .basicDescription("GitHub Actions를 활용하여 Docker 컨테이너 기반 배포를 자동화하는 스프린트입니다.")
                    .detailDescription("`Docker Build`, `Push to Docker Hub`, `AWS ECR` 배포 등을 학습하며, GitHub Actions와 Docker의 완벽한 연동을 실습합니다.")
                    .recommendedFor("Docker와 CI/CD 자동화를 함께 배우고 싶은 개발자\n컨테이너 기반 배포를 익히고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(7)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint53.setStatus(0);
            sprintRepository.save(sprint53);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint53, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(githubActions.getId());
            parent = githubActions.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(6);
            endAt = now.plusDays(8);
            Sprint sprint54 = SprintBuilder.builder()
                    .name("GitHub Actions로 테스트 자동화하기")
                    .basicDescription("GitHub Actions를 활용하여 자동 테스트 환경을 구축하는 스프린트입니다.")
                    .detailDescription("`Unit Test`, `Integration Test`, `Code Coverage`, `Lint Check` 등의 자동화 테스트 프로세스를 구축하는 법을 학습합니다.")
                    .recommendedFor("CI/CD 과정에서 자동화 테스트를 적용하고 싶은 개발자\n프로젝트 안정성을 높이고 싶은 개발자")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint54.setStatus(0);
            sprintRepository.save(sprint54);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint54, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(githubActions.getId());
            parent = githubActions.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(5);
            endAt = now.plusDays(11);
            Sprint sprint55 = SprintBuilder.builder()
                    .name("GitHub Actions 최적화 - 빠르고 효율적인 CI/CD 구축")
                    .basicDescription("GitHub Actions의 실행 속도를 최적화하고, 비용을 절감하는 방법을 배우는 스프린트입니다.")
                    .detailDescription("`Caching`, `Matrix Builds`, `Reusable Workflows`, `Self-hosted Runner` 등의 개념을 익히고, CI/CD의 실행 속도를 개선합니다.")
                    .recommendedFor("GitHub Actions의 성능을 최적화하고 싶은 개발자\n대규모 프로젝트에서 빠른 CI/CD 환경을 구축하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(7)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint55.setStatus(0);
            sprintRepository.save(sprint55);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint55, sprintCategory));
            });


            Category terraform = categoryRepository.findByCategoryNameWithParent("Terraform").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(terraform.getId());
            parent = terraform.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(2);
            endAt = now.plusDays(8);
            Sprint sprint56 = SprintBuilder.builder()
                    .name("Terraform으로 클라우드 인프라 자동화하기")
                    .basicDescription("Terraform을 활용하여 인프라를 코드로 관리하는 스프린트입니다.")
                    .detailDescription("Terraform의 기본 개념을 익히고, `terraform init`, `plan`, `apply` 명령어를 활용하여 AWS, GCP, Azure 같은 클라우드 환경을 자동화하는 방법을 학습합니다.")
                    .recommendedFor("Infrastructure as Code(IaC)에 관심 있는 개발자\nAWS, GCP, Azure 등의 클라우드 인프라를 Terraform으로 관리하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint56.setStatus(0);
            sprintRepository.save(sprint56);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint56, sprintCategory));
            });


            Category ansible = categoryRepository.findByCategoryNameWithParent("Ansible").orElseThrow(CategoryNotExistException::new);

            // AI/ML 하위 카테고리
            Category tensorFlow = categoryRepository.findByCategoryNameWithParent("TensorFlow").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(tensorFlow.getId());
            parent = tensorFlow.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(11);
            endAt = now.plusDays(13);
            Sprint sprint57 = SprintBuilder.builder()
                    .name("TensorFlow 기초 - 머신러닝 첫걸음")
                    .basicDescription("TensorFlow를 활용하여 머신러닝 기초 개념을 학습하는 스프린트입니다.")
                    .detailDescription("TensorFlow의 기본 구조, `Tensors`, `Operations`, `Graph`, `Session` 개념을 익히고, 간단한 머신러닝 모델을 구축해봅니다.")
                    .recommendedFor("머신러닝을 처음 배우는 개발자\nTensorFlow의 기본 개념을 익히고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint57.setStatus(0);
            sprintRepository.save(sprint57);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint57, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(tensorFlow.getId());
            parent = tensorFlow.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(3);
            endAt = now.plusDays(5);
            Sprint sprint58 = SprintBuilder.builder()
                    .name("TensorFlow 모델 최적화 - 성능 튜닝과 배포")
                    .basicDescription("TensorFlow를 활용하여 학습된 모델의 성능을 최적화하고 배포하는 방법을 배우는 스프린트입니다.")
                    .detailDescription("`TF Lite`, `TF Serving`, `Quantization`, `Pruning` 등을 활용하여 모델을 최적화하고, 클라우드 배포 방법을 실습합니다.")
                    .recommendedFor("TensorFlow 모델을 효율적으로 배포하고 싶은 개발자\n딥러닝 모델의 성능 최적화 및 경량화를 배우고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint58.setStatus(0);
            sprintRepository.save(sprint58);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint58, sprintCategory));
            });


            Category pyTorch = categoryRepository.findByCategoryNameWithParent("PyTorch").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(pyTorch.getId());
            parent = pyTorch.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(7);
            endAt = now.plusDays(13);
            Sprint sprint59 = SprintBuilder.builder()
                    .name("PyTorch 입문 - 기본 개념부터 간단한 모델 구축까지")
                    .basicDescription("PyTorch를 처음 배우는 개발자를 위한 기본 개념과 모델 구축 실습 스프린트입니다.")
                    .detailDescription("`Tensor`, `Autograd`, `nn.Module`, `DataLoader` 등의 개념을 익히고 간단한 딥러닝 모델을 구축하여 학습합니다.")
                    .recommendedFor("딥러닝을 처음 배우는 개발자\nPyTorch의 기본 구조를 익히고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint59.setStatus(0);
            sprintRepository.save(sprint59);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint59, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(pyTorch.getId());
            parent = pyTorch.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(2);
            endAt = now.plusDays(4);
            Sprint sprint60 = SprintBuilder.builder()
                    .name("PyTorch로 CNN 구현하기 - 이미지 분류 모델 만들기")
                    .basicDescription("PyTorch를 활용하여 CNN 기반 이미지 분류 모델을 구축하는 스프린트입니다.")
                    .detailDescription("`Conv2D`, `BatchNorm`, `MaxPool`, `Dropout`을 활용하여 ResNet, VGG 등의 구조를 학습하고, MNIST, CIFAR-10 데이터셋을 사용하여 실습합니다.")
                    .recommendedFor("PyTorch를 활용하여 CNN 모델을 구축해보고 싶은 개발자\n이미지 처리 딥러닝 모델을 배우고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint60.setStatus(0);
            sprintRepository.save(sprint60);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint60, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(pyTorch.getId());
            parent = pyTorch.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(4);
            endAt = now.plusDays(10);
            Sprint sprint61 = SprintBuilder.builder()
                    .name("PyTorch 모델 최적화 및 배포 - ONNX & TorchScript")
                    .basicDescription("PyTorch 모델을 최적화하고 ONNX 및 TorchScript를 활용한 배포 방법을 학습하는 스프린트입니다.")
                    .detailDescription("`TorchScript`, `ONNX`, `Quantization`, `Pruning` 등을 이용한 모델 최적화 및 경량화, 배포 방법을 실습합니다.")
                    .recommendedFor("딥러닝 모델을 효율적으로 배포하고 싶은 개발자\nPyTorch 모델의 성능을 최적화하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint61.setStatus(0);
            sprintRepository.save(sprint61);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint61, sprintCategory));
            });


            Category kubeflow = categoryRepository.findByCategoryNameWithParent("Kubeflow").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(kubeflow.getId());
            parent = kubeflow.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(2);
            endAt = now.plusDays(8);
            Sprint sprint62 = SprintBuilder.builder()
                    .name("Kubeflow로 MLOps 파이프라인 구축하기")
                    .basicDescription("Kubeflow를 활용하여 머신러닝 모델 개발부터 배포까지 자동화하는 스프린트입니다.")
                    .detailDescription("`Kubeflow Pipelines`, `TFJob`, `KFServing`을 활용하여 머신러닝 모델을 효과적으로 관리하고 배포하는 방법을 학습합니다.")
                    .recommendedFor("MLOps에 관심 있는 개발자\n대규모 머신러닝 모델을 자동화하고 싶은 개발자")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint62.setStatus(0);
            sprintRepository.save(sprint62);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint62, sprintCategory));
            });


            Category mlFlow = categoryRepository.findByCategoryNameWithParent("MLflow").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(mlFlow.getId());
            parent = mlFlow.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(13);
            endAt = now.plusDays(15);
            Sprint sprint63 = SprintBuilder.builder()
                    .name("MLflow로 머신러닝 모델 관리 및 실험 추적하기")
                    .basicDescription("MLflow를 활용하여 머신러닝 모델의 실험 및 배포를 효율적으로 관리하는 스프린트입니다.")
                    .detailDescription("`MLflow Tracking`, `MLflow Projects`, `MLflow Models`, `MLflow Registry`를 활용하여 머신러닝 모델 실험 및 배포 프로세스를 최적화합니다.")
                    .recommendedFor("머신러닝 실험을 체계적으로 관리하고 싶은 개발자\nMLflow 기반 MLOps 환경을 구축하고 싶은 개발자")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint63.setStatus(0);
            sprintRepository.save(sprint63);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint63, sprintCategory));
            });


            // Security 하위 카테고리
            Category sslTls = categoryRepository.findByCategoryNameWithParent("SSL/TLS").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(sslTls.getId());
            parent = sslTls.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(8);
            endAt = now.plusDays(14);
            Sprint sprint64= SprintBuilder.builder()
                    .name("SSL/TLS 기초 - HTTPS의 원리와 인증서 이해하기")
                    .basicDescription("SSL/TLS 프로토콜의 기본 개념과 HTTPS 보안 원리를 학습하는 스프린트입니다.")
                    .detailDescription("`SSL Handshake`, `Public Key & Private Key`, `Certificate Authority (CA)`, `TLS 1.2 vs TLS 1.3` 등의 개념을 익히고 HTTPS 보안이 어떻게 이루어지는지 실습합니다.")
                    .recommendedFor("SSL/TLS를 처음 배우는 개발자\nHTTPS를 직접 설정해보고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(7)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint64.setStatus(0);
            sprintRepository.save(sprint64);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint64, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(sslTls.getId());
            parent = sslTls.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(2);
            endAt = now.plusDays(4);
            Sprint sprint65= SprintBuilder.builder()
                    .name("SSL/TLS 보안 강화 - 최적의 설정과 취약점 방어")
                    .basicDescription("SSL/TLS 보안을 강화하는 방법과 최신 취약점에 대응하는 방법을 학습하는 스프린트입니다.")
                    .detailDescription("`Cipher Suites`, `HSTS(HTTP Strict Transport Security)`, `Perfect Forward Secrecy (PFS)`, `SSL Pinning` 등을 활용하여 보안성을 높이는 방법을 실습합니다.")
                    .recommendedFor("보안이 중요한 애플리케이션을 개발하는 개발자\nSSL/TLS의 최신 취약점 및 보안 강화를 적용하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint65.setStatus(0);
            sprintRepository.save(sprint65);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint65, sprintCategory));
            });


            Category firewall = categoryRepository.findByCategoryNameWithParent("Firewall").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(firewall.getId());
            parent = firewall.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(5);
            endAt = now.plusDays(11);
            Sprint sprint66= SprintBuilder.builder()
                    .name("방화벽 기초 - 네트워크 보안의 첫걸음")
                    .basicDescription("방화벽(Firewall)의 기본 개념과 역할을 학습하는 스프린트입니다.")
                    .detailDescription("`패킷 필터링`, `스테이트풀 인스펙션`, `애플리케이션 레벨 방화벽` 개념을 익히고, 방화벽이 네트워크 보안에서 어떤 역할을 하는지 학습합니다.")
                    .recommendedFor("네트워크 보안 개념을 익히고 싶은 개발자\n방화벽의 동작 원리를 이해하고 싶은 보안 엔지니어")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(8)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint66.setStatus(0);
            sprintRepository.save(sprint66);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint66, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(firewall.getId());
            parent = firewall.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(6);
            endAt = now.plusDays(12);
            Sprint sprint67= SprintBuilder.builder()
                    .name("방화벽 보안 정책 설정 및 실습")
                    .basicDescription("방화벽 정책을 설정하고 실제 환경에서 적용하는 방법을 학습하는 스프린트입니다.")
                    .detailDescription("`Firewall Rules`, `ACL (Access Control List)`, `IPS/IDS (침입 탐지 및 방지 시스템)`, `DMZ`를 활용하여 보안 정책을 설정하는 법을 실습합니다.")
                    .recommendedFor("실제 환경에서 방화벽을 설정하고 보안 정책을 적용하고 싶은 개발자\n보안 강화를 위한 네트워크 필터링을 배우고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(3)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint67.setStatus(0);
            sprintRepository.save(sprint67);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint67, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(firewall.getId());
            parent = firewall.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(1);
            endAt = now.plusDays(7);
            Sprint sprint68= SprintBuilder.builder()
                    .name("차세대 방화벽(NGFW)와 클라우드 보안")
                    .basicDescription("차세대 방화벽(NGFW, Next-Generation Firewall)과 클라우드 보안 기술을 학습하는 스프린트입니다.")
                    .detailDescription("`Deep Packet Inspection (DPI)`, `AI 기반 보안`, `클라우드 기반 방화벽`, `제로 트러스트 보안` 등의 최신 보안 트렌드를 학습하고 실습합니다.")
                    .recommendedFor("최신 보안 기술을 익히고 싶은 보안 엔지니어\n클라우드 환경에서 방화벽을 설정하고 싶은 개발자")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(4)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint68.setStatus(0);
            sprintRepository.save(sprint68);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint68, sprintCategory));
            });


            Category owaspTop10 = categoryRepository.findByCategoryNameWithParent("OWASP Top 10").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(owaspTop10.getId());
            parent = owaspTop10.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(2);
            endAt = now.plusDays(8);
            Sprint sprint69= SprintBuilder.builder()
                    .name("OWASP Top 10 - 웹 보안 취약점 분석과 대응")
                    .basicDescription("웹 애플리케이션 보안의 기본 개념과 OWASP Top 10을 학습하는 스프린트입니다.")
                    .detailDescription("`SQL Injection`, `XSS`, `CSRF`, `Broken Authentication`, `Security Misconfiguration` 등 웹 보안의 주요 취약점을 분석하고, 방어 전략을 학습합니다.")
                    .recommendedFor("웹 애플리케이션 보안에 관심 있는 개발자\nOWASP Top 10의 주요 취약점을 깊이 이해하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint69.setStatus(0);
            sprintRepository.save(sprint69);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint69, sprintCategory));
            });


            Category sastDast = categoryRepository.findByCategoryNameWithParent("SAST/DAST").orElseThrow(CategoryNotExistException::new);
            categoryIds = new ArrayList<>();
            categoryIds.add(sastDast.getId());
            parent = sastDast.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(3);
            endAt = now.plusDays(5);
            Sprint sprint70= SprintBuilder.builder()
                    .name("SAST - 코드 기반 보안 분석 및 자동화")
                    .basicDescription("정적 분석(SAST)을 활용하여 코드 내 보안 취약점을 사전에 탐지하는 스프린트입니다.")
                    .detailDescription("`Static Analysis`, `Code Scanning Tools (SonarQube, Checkmarx)`, `CI/CD 연동 보안 자동화` 등을 활용하여 소스 코드의 보안 취약점을 분석하고 대응하는 방법을 학습합니다.")
                    .recommendedFor("정적 코드 분석을 통해 보안성을 높이고 싶은 개발자\nCI/CD 환경에서 보안 자동화를 도입하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)  // 5~10명
                    .defaultTodos(generateThreeDayTodos(startAt))
                    .build();
            sprint70.setStatus(0);
            sprintRepository.save(sprint70);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint70, sprintCategory));
            });

            categoryIds = new ArrayList<>();
            categoryIds.add(sastDast.getId());
            parent = sastDast.getParent();
            if (parent != null) {
                categoryIds.add(parent.getId());
                Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                if (grandParent != null) {
                    categoryIds.add(grandParent.getId());
                }
            }
            startAt = now.plusDays(4);
            endAt = now.plusDays(6);
            Sprint sprint71= SprintBuilder.builder()
                    .name("DAST - 웹 애플리케이션 동적 분석 및 보안 강화")
                    .basicDescription("동적 분석(DAST)을 활용하여 실행 중인 애플리케이션의 보안 취약점을 탐지하는 스프린트입니다.")
                    .detailDescription("`Dynamic Application Security Testing`, `Burp Suite`, `OWASP ZAP`, `실시간 공격 시뮬레이션` 등을 이용하여 보안 취약점을 탐지하고 대응하는 방법을 실습합니다.")
                    .recommendedFor("웹 애플리케이션의 보안 취약점을 분석하고 싶은 개발자\nDAST 도구를 활용하여 공격 시뮬레이션을 수행하고 싶은 분")
                    .startAt(startAt)
                    .endAt(endAt)
                    .announceAt(endAt)
                    .maxMembers(6)  // 5~10명
                    .defaultTodos(generateTodos(startAt))
                    .build();
            sprint71.setStatus(0);
            sprintRepository.save(sprint71);
            categoryIds.forEach(categoryId -> {
                Category sprintCategory = categoryRepository.findById(categoryId)
                        .orElseThrow(CategoryNotExistException::new);
                sprintCategoryRepository.save(new SprintCategory(sprint71, sprintCategory));
            });

            System.out.println("🚀 스프린트 데이터가 성공적으로 추가되었습니다!");
        } else {
            System.out.println("✅ 스프린트 데이터가 이미 존재합니다.");
        }
    }


//
    /** 7일치 TodoRequest 생성 */
    private List<TodoRequest> generateTodos(LocalDateTime startAt) {
        List<TodoRequest> todos = new ArrayList<>();
        Random random = new Random();

        String[][] tasksByDay = {
                {"기본 개념 학습", "아키텍처 개요", "핵심 원리 이해"},
                {"설치 및 환경 설정", "기본 코드 작성", "간단한 예제 구현"},
                {"주요 기능 익히기", "실전 프로젝트 적용", "API 활용"},
                {"보안 및 최적화", "고급 기능 활용", "성능 테스트"},
                {"실전 문제 해결", "버그 수정 및 디버깅", "모범 사례 학습"},
                {"프로젝트 확장 및 배포", "서드파티 연동", "실제 환경 적용"},
                {"최종 복습 및 발표", "코드 리뷰", "QA 세션"}
        };

        for (int i = 0; i < 7; i++) {
            LocalDate date = startAt.toLocalDate().plusDays(i);
            List<String> tasks = List.of(tasksByDay[i]);

            todos.add(new TodoRequest(date, tasks));
        }

        return todos;
    }


    /** 3일치 TodoRequest 생성 */
    private List<TodoRequest> generateThreeDayTodos(LocalDateTime startAt) {
        List<TodoRequest> todos = new ArrayList<>();

        String[][] tasksByDay = {
                {"기본 개념 학습", "아키텍처 개요", "핵심 원리 이해"},
                {"설치 및 환경 설정", "기본 코드 작성", "간단한 예제 구현"},
                {"주요 기능 익히기", "실전 프로젝트 적용", "API 활용"}
        };

        for (int i = 0; i < 3; i++) { // 3일치만 생성
            LocalDate date = startAt.toLocalDate().plusDays(i);
            List<String> tasks = List.of(tasksByDay[i]);

            todos.add(new TodoRequest(date, tasks));
        }

        return todos;
    }

    private List<TodoRequest> generateReactTodos(LocalDateTime startAt) {
        List<TodoRequest> todos = new ArrayList<>();
        Random random = new Random();

        String[][] tasksByDay = {
                {"React의 상태 관리 개념 이해", "useState의 필요성 파악", "기본 문법 익히기"},
                {"useState 선언 및 초기값 설정", "setState를 활용한 상태 변경 실습", "기본 예제 구현"},
                {"다양한 데이터 타입 상태 관리", "배열, 객체를 useState로 다루기", "불변성 개념 학습"},
                {"이벤트 핸들러와 useState 연동", "onChange, onClick 이벤트와 상태 변경", "실전 예제 구현"},
                {"useState를 활용한 간단한 TODO 앱 만들기", "입력값 상태 관리", "리스트 추가 및 삭제"},
                {"useState 최적화 및 성능 고려", "불필요한 렌더링 방지 기법", "useCallback과의 조합"},
                {"최종 프로젝트 실습", "코드 리뷰 및 피드백", "질문 & 답변 세션"}
        };

        for (int i = 0; i < 7; i++) {
            LocalDate date = startAt.toLocalDate().plusDays(i);
            List<String> tasks = List.of(tasksByDay[i]);

            todos.add(new TodoRequest(date, tasks));
        }

        return todos;
    }

    private List<TodoRequest> generateVueTodos(LocalDateTime startAt) {
        List<TodoRequest> todos = new ArrayList<>();
        Random random = new Random();

        String[][] tasksByDay = {
                {"Vue Router의 기본 개념 학습", "SPA(Single Page Application) 개념 이해", "기본적인 Vue Router 설정 실습"},
                {"라우트 설정 및 네비게이션 구현", "동적 라우팅과 네임드 뷰 학습", "네비게이션 링크 활용"},
                {"네비게이션 가드의 개념 이해", "beforeEach, beforeEnter, afterEach 가드 학습", "기본적인 인증 가드 구현"},
                {"로그인 여부에 따른 접근 제한 구현", "Vuex 또는 Pinia를 활용한 인증 상태 관리", "로그인 여부에 따라 특정 페이지 접근 제한 실습"},
                {"사용자 권한별 접근 제어", "meta 필드를 활용한 역할 기반 인증", "관리자/사용자 역할에 따른 페이지 접근 실습"},
                {"네비게이션 가드 고급 활용", "비동기 데이터 로딩 시 네비게이션 가드 적용", "에러 페이지 및 리다이렉션 처리"},
                {"최종 프로젝트 실습", "라우트 가드 적용한 인증 시스템 구현", "코드 리뷰 및 QA 세션"}
        };

        for (int i = 0; i < 7; i++) {
            LocalDate date = startAt.toLocalDate().plusDays(i);
            List<String> tasks = List.of(tasksByDay[i]);

            todos.add(new TodoRequest(date, tasks));
        }

        return todos;
    }

    private List<TodoRequest> generateIndexTodos(LocalDateTime startAt) {
        List<TodoRequest> todos = new ArrayList<>();
        Random random = new Random();

        String[][] tasksByDay = {
                {"SQL 조인의 기본 개념 학습", "INNER JOIN, LEFT JOIN, RIGHT JOIN 차이 이해", "실습을 위한 샘플 데이터 생성"},
                {"Nested Loop Join 개념 이해", "인덱스 미적용 vs 적용 비교", "실제 쿼리 실행 계획 분석"},
                {"Hash Join 개념과 활용", "대량 데이터 조인 시 성능 비교", "조인 키에 대한 해시 인덱스 적용 실험"}
        };

        for (int i = 0; i < 3; i++) {
            LocalDate date = startAt.toLocalDate().plusDays(i);
            List<String> tasks = List.of(tasksByDay[i]);

            todos.add(new TodoRequest(date, tasks));
        }

        return todos;
    }


    private List<TodoRequest> generateExpressTodos(LocalDateTime startAt) {
        List<TodoRequest> todos = new ArrayList<>();
        Random random = new Random();

        String[][] tasksByDay = {
                {"ExpressJS 기본 개념 복습", "미들웨어의 동작 원리 이해", "기본적인 API 엔드포인트 생성"},
                {"비동기 프로그래밍 개념 정리", "콜백 함수와 콜백 지옥 해결 방법", "Promise 기본 문법 익히기"},
                {"async/await 심화 학습", "Promise와 async/await 비교", "try/catch를 활용한 에러 핸들링"},
                {"Express에서 비동기 처리", "비동기 미들웨어 구현", "express-async-handler 활용법 익히기"},
                {"데이터베이스 연동과 비동기 처리", "Mongoose와 비동기 요청 핸들링", "트랜잭션과 비동기 처리 전략 학습"},
                {"비동기 흐름 제어와 성능 최적화", "이벤트 루프와 비동기 작업 최적화", "Node.js Worker Threads 개념 이해"},
                {"최종 프로젝트 실습", "비동기 API를 활용한 RESTful 서비스 구축", "코드 리뷰 및 최적화"}
        };

        for (int i = 0; i < 7; i++) {
            LocalDate date = startAt.toLocalDate().plusDays(i);
            List<String> tasks = List.of(tasksByDay[i]);

            todos.add(new TodoRequest(date, tasks));
        }

        return todos;
    }

    private List<TodoRequest> generateSpringBootTodos(LocalDateTime startAt) {
        List<TodoRequest> todos = new ArrayList<>();
        Random random = new Random();

        String[][] tasksByDay = {
                {"Spring Boot 개요 및 프로젝트 생성", "@GetMapping, @PostMapping, @RequestMapping 학습", "간단한 API 엔드포인트 작성"},
                {"Spring Boot의 DI와 IoC 개념", "@Component, @Service, @Autowired 학습", "의존성 주입을 활용한 서비스 레이어 구현"}
        };

        for (int i = 0; i < 2; i++) {
            LocalDate date = startAt.toLocalDate().plusDays(i);
            List<String> tasks = List.of(tasksByDay[i]);

            todos.add(new TodoRequest(date, tasks));
        }

        return todos;
    }

    private List<TodoRequest> generateDockerJenkinsTodos(LocalDateTime startAt) {
        List<TodoRequest> todos = new ArrayList<>();
        Random random = new Random();

        String[][] tasksByDay = {
                {"Docker와 Jenkins 개요", "CI/CD 기본 개념 복습", "Docker 설치 및 환경 설정"},
                {"Jenkins 컨테이너 실행", "Docker를 활용한 Jenkins 구축", "Jenkins 기본 설정 및 플러그인 설치"},
                {"Jenkinsfile 작성 및 파이프라인 구축", "단계별 빌드 & 테스트 자동화", "멀티스테이지 빌드 적용 및 최적화"}
        };

        for (int i = 0; i < 3; i++) {
            LocalDate date = startAt.toLocalDate().plusDays(i);
            List<String> tasks = List.of(tasksByDay[i]);

            todos.add(new TodoRequest(date, tasks));
        }

        return todos;
    }
//
//    @Transactional
//    public void initializeSprintParticipation(SprintRepository sprintRepository,
//                                              UserRepository userRepository,
//                                              TeamRepository teamRepository,
//                                              SprintService sprintService,
//                                              QuestionCardService questionCardService,
//                                              DiaryService diaryService) {
//        if (teamRepository.count() > 0) {
//            System.out.println("✅ 기존 팀이 존재하므로 스프린트 초기화 생략");
//            return;
//        }
//
//        List<Sprint> allSprints = sprintRepository.findAll();
//        List<User> admins = userRepository.findAllWithTeams().stream()
//                .filter(user -> user.getEmail().startsWith("admin1") || user.getEmail().startsWith("admin2"))
//                .toList();
//
//        for (Sprint sprint : allSprints) {
//            System.out.println("----------스프린트 ID " + sprint.getId() + "-----------");
//
//            for (User admin : admins) {
//                System.out.println("----------사용자 ID " + admin.getId() + "-----------");
//                sprintService.joinSprint(sprint.getId(), admin, sprint.getId() + "_" + admin.getId());
//            }
//
//            // ✅ Sprint ID가 2+3*x인 경우에 QuestionCard 및 Diary 추가
//            if ((sprint.getId() - 2) % 3 == 0) {
//                List<Team> teams = teamRepository.findBySprint(sprint); // ✅ 해당 Sprint의 팀 가져오기
//
//                for (Team team : teams) {
//                    // ✅ 각 팀별로 QuestionCard 생성
//                    QuestionCardRequest questionCardRequest = new QuestionCardRequest(
//                            sprint.getId(),
//                            team.getId(), // ✅ 팀 ID 추가
//                            "Sprint " + sprint.getId() + "의 팀 [" + team.getName() + "]을 위한 질문 카드입니다.",
//                            false
//                    );
//                    questionCardService.createQuestionCard(questionCardRequest);
//                }
//
//                // ✅ Diary 추가 (스프린트 시작일부터 종료일까지 모든 날짜 추가)
//                for (Team team : teams) {
//                    LocalDate startDate = sprint.getStartAt().toLocalDate();
//                    LocalDate endDate = sprint.getEndAt().toLocalDate();
//
//                    for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
//                        Diary diary = new Diary(team, team.getName(),
//                                "Sprint " + sprint.getId() + "의 " + date + " 일기 내용입니다.", date);
//                        diaryService.saveDiary(diary);
//                    }
//                }
//            }
//        }
//
//        System.out.println("✅ 모든 Sprint에 admin1~admin2이 참가하고, 특정 Sprint에 QuestionCard 및 Diary가 추가되었습니다.");
//    }






    //    @Transactional
//    public void initializeComments(CommentRepository commentRepository, BoardRepository boardRepository, UserRepository userRepository) {
//        if (commentRepository.count() == 0) {
//            List<Comment> commentList = new ArrayList<>();
//            LocalDateTime now = LocalDateTime.now();
//            Random random = new Random();
//
//            // 모든 게시글 가져오기
//            List<Board> boards = boardRepository.findAll();
//            if (boards.isEmpty()) {
//                System.out.println("No board data found. Initialize boards first.");
//                return;
//            }
//
//            // 모든 사용자 가져오기
//            List<User> users = userRepository.findAll();
//            if (users.isEmpty()) {
//                System.out.println("No user data found. Initialize users first.");
//                return;
//            }
//
//            // 각 게시글에 3~5개의 랜덤 댓글 생성
//            for (Board board : boards) {
//                int commentCount = random.nextInt(3) + 3; // 3~5개 댓글 생성
//
//                for (int i = 0; i < commentCount; i++) {
//                    User randomUser = users.get(random.nextInt(users.size())); // 랜덤 사용자 선택
//
//                    Comment comment = Comment.builder()
//                            .user(randomUser)
//                            .board(board)
//                            .parent(null) // 기본적으로 부모 없는 댓글(최상위 댓글)
//                            .content("이 게시글에 대한 댓글입니다! 댓글 번호: " + (i + 1))
//                            .createdAt(now.minusDays(random.nextInt(10))) // 최근 10일 내 랜덤 날짜 설정
//                            .updatedAt(now)
//                            .disclosure(true)
//                            .build();
//
//                    commentList.add(comment);
//                }
//            }
//
//            // 데이터 저장
//            commentRepository.saveAll(commentList);
//            System.out.println("Default comment data added.");
//        } else {
//            System.out.println("Comment data already exists.");
//        }
//    }
//
//    @Transactional
//    public void initializeReplies(CommentRepository commentRepository, UserRepository userRepository) {
//        if (commentRepository.count() > 0) {
//            List<Comment> allComments = commentRepository.findAll(); // 기존 댓글 불러오기
//            List<User> users = userRepository.findAll();
//            Random random = new Random();
//
//            List<Comment> replyList = new ArrayList<>();
//            LocalDateTime now = LocalDateTime.now();
//
//            // 기존 댓글 중 일부를 부모로 하여 대댓글 추가 (깊이 제한 설정)
//            for (Comment parentComment : allComments) {
//                if (random.nextBoolean()) { // 50% 확률로 대댓글 생성
//                    if (getDepth(parentComment) >= 1) { // 깊이가 3 이상이면 생성하지 않음
//                        continue;
//                    }
//
//                    User randomUser = users.get(random.nextInt(users.size())); // 랜덤 사용자 선택
//
//                    Comment reply = Comment.builder()
//                            .user(randomUser)
//                            .board(parentComment.getBoard())
//                            .parent(parentComment) // 부모 댓글 설정 (깊이 1~3까지만 허용)
//                            .content("대댓글입니다! 부모 댓글 ID: " + parentComment.getId())
//                            .createdAt(now.minusDays(random.nextInt(5))) // 최근 5일 내 랜덤 날짜 설정
//                            .updatedAt(now)
//                            .disclosure(true)
//                            .build();
//
//                    replyList.add(reply);
//                }
//            }
//
//            // 대댓글 저장
//            if (!replyList.isEmpty()) {
//                commentRepository.saveAll(replyList);
//                System.out.println("✅ Default reply comment data added.");
//            }
//        } else {
//            System.out.println("⚠️ No parent comments found. Initialize comments first.");
//        }
//    }
//
//    // 댓글의 깊이를 계산하는 메서드 (부모-자식 관계 확인)
//    private int getDepth(Comment comment) {
//        int depth = 0;
//        while (comment.getParent() != null) {
//            depth++;
//            comment = comment.getParent();
//        }
//        return depth;
//    }


}

