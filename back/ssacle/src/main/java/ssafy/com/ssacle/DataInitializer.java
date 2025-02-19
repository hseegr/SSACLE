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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
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
            initializeSsaldCups(ssaldCupRepository, sprintRepository, categoryRepository,ssaldCupCategoryRepository, sprintCategoryRepository);
            //initializeSsaldCupParticipation(ssaldCupRepository, userRepository, teamRepository);
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
            Category googlecloud = Category.builder().categoryName("Google Cloud").parent(infra).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Google+Cloud.png").build();
            Category azure = Category.builder().categoryName("Azure").parent(infra).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Azure.png").build();
            Category aws = Category.builder().categoryName("AWS").parent(infra).level(2).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/AWS.png").build();
            categoryRepository.saveAll(List.of(docker, kunernetes, googlecloud, azure, aws));

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
            };

            // 뉴스 데이터 추가
            for (int i = 0; i < newsData.length; i++) {
                LocalDateTime newsDate = today.plusDays(i/3);
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



    @Transactional
    public void initializeSprints(SprintRepository sprintRepository,
                                  CategoryRepository categoryRepository,
                                  SprintCategoryRepository sprintCategoryRepository) {
        if (sprintRepository.count() == 0) {
            List<Sprint> sprints = new ArrayList<>();
            List<SprintCategory> sprintCategories = new ArrayList<>();
            LocalDateTime now = LocalDateTime.now();
            Random random = new Random();

            // ✅ level 3인 카테고리만 조회
            List<Category> lowestLevelCategories = categoryRepository.findLowestLevelCategoriesByJoin();

            for (Category category : lowestLevelCategories) {
                List<Long> categoryIds = new ArrayList<>();
                categoryIds.add(category.getId());
                // ✅ 부모 카테고리와 조부모 카테고리 초기화
                Category parent = category.getParent();

                if (parent != null) {
                    categoryIds.add(parent.getId());
                    Category grandParent = parent.getParent();  // 여기서 LazyInitializationException 발생 가능
                    if (grandParent != null) {
                        categoryIds.add(grandParent.getId());
                    }
                }
                StringBuilder sb = new StringBuilder();
                for(Long catgoryId : categoryIds){
                    Category c= categoryRepository.findById(catgoryId).orElseThrow(()-> new CategoryNotExistException());
                    sb.append(c.getCategoryName()+" ");
                }
                String recommend = sb.toString().trim();
                recommend.replaceAll(" ",",");
                for (int i = 0; i < 3; i++) { // 각 카테고리당 3개씩 생성
                    LocalDateTime startAt;
                    LocalDateTime endAt;

                    if (i == 0) { // 시작 전 (status = 0)
                        int start = random.nextInt(2);
                        startAt = now.plusDays(start + 3);
                        endAt = startAt.plusDays(start+ 10);
                    } else if (i == 1) { // 진행 중 (status = 1)
                        startAt = now.minusDays(7);
                        endAt = now;
                    } else { // 종료됨 (status = 2)
                        int start = random.nextInt(2);
                        startAt = now.minusDays(start + 9);
                        endAt = startAt.minusDays(start+2);
                    }

                    Sprint sprint = SprintBuilder.builder()
                            .name(category.getCategoryName() + " Sprint " + (i + 1))
                            .basicDescription("학습 내용: " + category.getCategoryName())
                            .detailDescription(category.getCategoryName() + " 관련 프로젝트와 실습")
                            .recommendedFor(recommend)
                            .startAt(startAt)
                            .endAt(endAt)
                            .announceAt(endAt)
                            .maxMembers(2+random.nextInt(3))
                            .defaultTodos(generateTodos(startAt)) // 7일치 Todo 데이터 추가
                            .build();
                    if(i==1){
                        sprint.setStatus(1);
                    }else if(i==2){
                        sprint.setStatus(2);
                    }
                    sprintRepository.save(sprint);

                    // ✅ 부모, 조부모 카테고리 연결
                    categoryIds.forEach(categoryId -> {
                        Category sprintCategory = categoryRepository.findById(categoryId)
                                .orElseThrow(CategoryNotExistException::new);
                        sprintCategoryRepository.save(new SprintCategory(sprint, sprintCategory));
                    });

                    sprints.add(sprint);
                }
            }
            System.out.println("스프린트 데이터가 성공적으로 추가되었습니다.");
        } else {
            System.out.println("스프린트 데이터가 이미 존재합니다.");
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

    @Transactional
    public void initializeSsaldCups(SsaldCupRepository ssaldCupRepository,
                                    SprintRepository sprintRepository,
                                    CategoryRepository categoryRepository,
                                    SsaldCupCategoryRepository ssaldCupCategoryRepository,
                                    SprintCategoryRepository sprintCategoryRepository) {
        if (ssaldCupRepository.count() == 0) {
            List<SsaldCup> ssaldCups = new ArrayList<>();
            List<SsaldCupCategory> ssaldCupCategories = new ArrayList<>();
            LocalDateTime now = LocalDateTime.now();
            Random random = new Random();
            List<Category> midLevelCategories = categoryRepository.findMidLevelCategoriesByJoin();
            List<Category> lowestLevelCategories = categoryRepository.findLowestLevelCategoriesByJoin();

            for (Category category : midLevelCategories) {
                List<Long> categoryIds = new ArrayList<>();
                categoryIds.add(category.getId());
                Category parent = category.getParent();
                if (parent != null) {
                    categoryIds.add(parent.getId());
                }

                for (int i = 0; i < 3; i++) {
                    LocalDateTime startAt;
                    LocalDateTime endAt;

                    if (i == 0) { // 시작 전 (status = 0)
                        int start = random.nextInt(2);
                        if(start<=0)
                            start=1;
                        int week = random.nextInt(8);
                        if(week <=0)
                            week=1;
                        startAt = now.plusDays(start);
                        endAt = startAt.plusDays(start).plusWeeks(week);
                    } else if (i == 1) { // 진행 중 (status = 1)
                        int week = random.nextInt(5);
                        if(week <=0)
                            week=1;
                        startAt = now.minusWeeks(week);
                        endAt = now;
                    } else { // 종료됨 (status = 2)
                        int start = random.nextInt(2);
                        if(start<=0)
                            start=1;
                        int week = random.nextInt(6);
                        if(week <=0)
                            week=1;
                        startAt = now.minusDays(start).minusWeeks(week+2);
                        endAt = startAt.minusDays(start).minusWeeks(week+2).plusWeeks(1);
                    }

//                    // ✅ 1번 싸드컵은 9주 동안 진행되도록 설정
//                    if (ssaldCups.isEmpty()) {
//                        startAt = now;
//                        endAt = startAt.plusWeeks(9);
//                    }

                    SsaldCup ssaldCup = SsaldCupBuilder.builder()
                            .name(category.getCategoryName() + " SsaldCup " + (i + 1))
                            .basicDescription("학습 내용: " + category.getCategoryName())
                            .detailDescription(category.getCategoryName() + " 관련 프로젝트와 실습")
                            .maxTeams(random.nextInt(8)) // ✅ 10팀 설정
                            .maxTeamMembers(random.nextInt(4))
                            .startAt(startAt)
                            .endAt(endAt)
                            .build();
                    if(ssaldCup.getStartAt().isAfter(now)){
                        ssaldCup.setStatus(0);
                    }else if(ssaldCup.getStartAt().isEqual(now) || (ssaldCup.getStartAt().isBefore(now) && ssaldCup.getEndAt().isAfter(now)))
                        ssaldCup.setStatus(1);
                    else ssaldCup.setStatus(2);
                    StringBuilder recommend = new StringBuilder();
                    ssaldCupRepository.save(ssaldCup);
                    StringBuilder sb = new StringBuilder();
                    for (Long categoryId : categoryIds) {
                        Category ssaldCupCategory = categoryRepository.findById(categoryId)
                                .orElseThrow(CategoryNotExistException::new);
                        ssaldCupCategoryRepository.save(new SsaldCupCategory(ssaldCup, ssaldCupCategory));
                        sb.append(ssaldCupCategory.getCategoryName()).append(" ");
                    }
                    String recommendFor = sb.toString().trim().replaceAll(" ", ",");
//
//                    categoryIds.forEach(categoryId -> {
//                        Category ssaldCupCategory = categoryRepository.findById(categoryId)
//                                .orElseThrow(CategoryNotExistException::new);
//                        ssaldCupCategoryRepository.save(new SsaldCupCategory(ssaldCup, ssaldCupCategory));
//                        recommend.append(ssaldCupCategory.getCategoryName()+" ");
//                    });
                    recommendFor.replaceAll(" ",",");
                    ssaldCups.add(ssaldCup);

                    List<Category> relatedLowestCategories = lowestLevelCategories.stream()
                            .filter(lowestCategory -> lowestCategory.getParent() != null &&
                                    lowestCategory.getParent().getId().equals(category.getId()))
                            .collect(Collectors.toList());

                    int duration = (int)ChronoUnit.WEEKS.between(startAt, endAt);
                    LocalDateTime start =startAt;
                    for (int j = 0; j < duration; j++) {
                        LocalDateTime sprintStart=start;
                        if(j>0)
                            sprintStart=sprintStart.plusWeeks(j);
                        LocalDateTime sprintEnd = start.plusWeeks(j+1);
                        LocalDateTime announceAt = sprintEnd;
                        if(relatedLowestCategories.size()==0)
                            continue;
                        int rand = random.nextInt(relatedLowestCategories.size());
                        int num = rand > 0 ? rand : 0;
                        Category selectedLowestCategory = relatedLowestCategories.get(num);

                        Sprint sprint = SprintBuilder.builder()
                                .name(ssaldCup.getName() + "_Sprint_" + (j + 1))
                                .basicDescription("학습 내용: " + category.getCategoryName())
                                .detailDescription(category.getCategoryName() + " 관련 프로젝트와 실습")
                                .recommendedFor(recommendFor)
                                .startAt(sprintStart)
                                .endAt(sprintEnd)
                                .announceAt(announceAt)
                                .maxMembers(ssaldCup.getMaxTeamMembers())
                                .sequence(j + 1)
                                .ssaldCup(ssaldCup)
                                .build();
                        LocalDateTime time = LocalDateTime.now();
                        if(sprint.getStartAt().isAfter(time))
                            sprint.setStatus(0);
                        else if(sprint.getStartAt().isEqual(time) || (sprint.getStartAt().isBefore(time)&& sprint.getEndAt().isAfter(time)))
                            sprint.setStatus(1);
                        else
                            sprint.setStatus(2);
                        sprintRepository.save(sprint);
                        sprintCategoryRepository.save(new SprintCategory(sprint, selectedLowestCategory));
                    }
                }
            }
            System.out.println("싸드컵과 하위 스프린트가 추가되었습니다.");
        } else {
            System.out.println("싸드컵 더미 데이터가 이미 존재합니다.");
        }
    }



//    @Transactional
//    public void initializeSsaldCupParticipation(SsaldCupRepository ssaldCupRepository,
//                                                UserRepository userRepository,
//                                                TeamRepository teamRepository) {
//
//        // ✅ 1번 싸드컵 조회
//        SsaldCup ssaldCup = ssaldCupRepository.findById(1L)
//                .orElseThrow(() -> new IllegalStateException("1번 싸드컵이 존재하지 않습니다."));
//
//        // ✅ ID=1~20인 사용자 조회
//        List<User> temp = userRepository.findAllWithUserTeams();
//        List<User> users = new ArrayList<>();
//        for (User user : temp) {
//            if (user.getId() >= 1 && user.getId() <= 20) {
//                users.add(user);
//            }
//        }
//
//        if (users.size() < 20) {
//            throw new IllegalStateException("ID=1~20인 사용자가 20명 존재해야 합니다.");
//        }
//
//        List<Team> teams = new ArrayList<>();
//
//        // ✅ 2명씩 10팀 구성
//        for (int i = 0; i < 10; i++) {
//            Team team = new Team("Team" + (i + 1), 0);
//            team.addUser(users.get(i * 2));
//            team.addUser(users.get(i * 2 + 1));
//            team.setCurrentMembers(2);
//            team.setSsaldCup(ssaldCup);
//            teams.add(team);
//        }
//
//        teamRepository.saveAll(teams);
//
//        System.out.println("✅ 1번 싸드컵에 10개 팀이 생성되었습니다.");
//    }


}

