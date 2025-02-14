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
import ssafy.com.ssacle.category.repository.CategoryRepository;
import ssafy.com.ssacle.comment.domain.Comment;
import ssafy.com.ssacle.comment.repository.CommentRepository;
import ssafy.com.ssacle.lunch.domain.Lunch;
import ssafy.com.ssacle.lunch.repository.LunchRepository;
import ssafy.com.ssacle.sprint.domain.Sprint;
import ssafy.com.ssacle.sprint.domain.SprintBuilder;
import ssafy.com.ssacle.sprint.repository.SprintRepository;
import ssafy.com.ssacle.team.domain.SprintTeamBuilder;
import ssafy.com.ssacle.team.domain.Team;
import ssafy.com.ssacle.team.repository.TeamRepository;
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.exception.CannotLoginException;
import ssafy.com.ssacle.user.exception.LoginErrorCode;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.usercategory.domain.UserCategory;
import ssafy.com.ssacle.usercategory.repository.UserCategoryRepository;
import ssafy.com.ssacle.userteam.domain.UserTeam;
import ssafy.com.ssacle.userteam.repository.UserTeamRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

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
            SprintCategoryRepository sprintCategoryRepository) {

        return args -> {
            initializeUsers(userRepository);
            initializeCategory(categoryRepository);
            initializeUserCategories(userRepository, categoryRepository, userCategoryRepository);
            initializeBoardType(boardTypeRepository);
            initializeBoard(boardRepository, boardTypeRepository, userRepository);
            initializeComments(commentRepository, boardRepository, userRepository);
            initializeReplies(commentRepository, userRepository);
            initializeAINews(aiNewsRepository);
            initializeLunch(lunchRepository);
            initializeSprints(sprintRepository,categoryRepository,sprintCategoryRepository);
            initializeTeams(sprintRepository,teamRepository,userRepository,userTeamRepository);
        };
    }

    @Transactional
    public void initializeUsers(UserRepository userRepository) {
        if (userRepository.count() == 0) { // 기존 데이터가 없을 경우에만 추가
            User admin = User.createAdmin("admin1@example.com", "admin1234", "AdminUser1");
            User admin2 = User.createAdmin("admin2@example.com", "admin1234", "AdminUser2");
            User admin3 = User.createAdmin("admin3@example.com", "admin1234", "AdminUser3");
            User admin4 = User.createAdmin("admin4@example.com", "admin1234", "AdminUser4");
            User admin5 = User.createAdmin("admin5@example.com", "admin1234", "AdminUser5");
            User admin6 = User.createAdmin("admin6@example.com", "admin1234", "AdminUser6");
            User admin7 = User.createAdmin("admin7@example.com", "admin1234", "AdminUser7");
            User admin8 = User.createAdmin("admin8@example.com", "admin1234", "AdminUser8");

            User user = User.createStudent("user@example.com", "user123", "John Doe", "1234567", "johndoe");
            userRepository.save(admin);
            userRepository.save(admin2);
            userRepository.save(admin3);
            userRepository.save(admin4);
            userRepository.save(admin5);
            userRepository.save(admin6);
            userRepository.save(admin7);
            userRepository.save(admin8);
            userRepository.save(user);
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
            Category spring = Category.builder().categoryName("Spring").parent(backEnd).level(2).build();
            Category django = Category.builder().categoryName("Django").parent(backEnd).level(2).build();
            Category nodejs = Category.builder().categoryName("Node.js").parent(backEnd).level(2).build();
            Category nestjs = Category.builder().categoryName("NestJS").parent(backEnd).level(2).build();
            Category flask = Category.builder().categoryName("Flask").parent(backEnd).level(2).build();
            Category laravel = Category.builder().categoryName("Laravel").parent(backEnd).level(2).build();

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
            Category react = Category.builder().categoryName("React").parent(frontEnd).level(2).build();
            Category vue = Category.builder().categoryName("Vue.js").parent(frontEnd).level(2).build();
            Category angular = Category.builder().categoryName("Angular").parent(frontEnd).level(2).build();
            Category svelte = Category.builder().categoryName("Svelte").parent(frontEnd).level(2).build();

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
            Category mysql = Category.builder().categoryName("MySQL").parent(database).level(2).build();
            Category postgresql = Category.builder().categoryName("PostgreSQL").parent(database).level(2).build();
            Category mongodb = Category.builder().categoryName("MongoDB").parent(database).level(2).build();
            Category redis = Category.builder().categoryName("Redis").parent(database).level(2).build();

            categoryRepository.saveAll(List.of(mysql, postgresql, mongodb, redis));

            List<Category> databaseChildren = List.of(
                    Category.builder().categoryName("Indexing").parent(mysql).level(3).build(),
                    Category.builder().categoryName("ACID").parent(postgresql).level(3).build(),
                    Category.builder().categoryName("Sharding").parent(mongodb).level(3).build(),
                    Category.builder().categoryName("Cache Strategies").parent(redis).level(3).build()
            );

            categoryRepository.saveAll(databaseChildren);

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
                            "GC녹십자, 독감약-혈액제제로 실적개선 꾀한다",
                            "https://www.dt.co.kr/contents.html?article_no=2025021002109931054001"
                    },
                    {
                            "과기정통부, 혁신도전형 R&D 사업군 발표…10%는 AI 사업",
                            "https://www.etnews.com/20250210000201"
                    },
                    {
                            "삼성전자, 에어컨 출시…'쾌적제습' 기능 추가",
                            "https://www.hani.co.kr/arti/economy/it/0000000.html"
                    },
                    // 1일 전 뉴스
                    {
                            "현대그린푸드 'AI로 구내식당 혼잡도 알려드려요'",
                            "https://www.yna.co.kr/view/AKR20250209000000017"
                    },
                    {
                            "국정원 '딥시크, 민감한 질문에 언어별로 다른 답 내놔'",
                            "https://www.mk.co.kr/news/it/0000001"
                    },
                    {
                            "샘 올트먼의 파격 예언 '인간 버금가는 AI, 10년내 온다'",
                            "https://www.joongang.co.kr/article/0000002"
                    },
                    // 2일 전 뉴스
                    {
                            "초·중등 교원 위한 정보과 교육 지침서, '정보과 교육 이론과 실제' 출간",
                            "https://itnews.or.kr/?p=12345"
                    },
                    {
                            "잇플, '10대를 위한 데이터과학 with 파이썬' 출간",
                            "https://itnews.or.kr/?p=12346"
                    },
                    {
                            "안종배 국제미래학회장 '인류혁명 문명대변혁' 출간",
                            "https://itnews.or.kr/?p=12347"
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
                            "K 의료기기, 중동 오일머니 사로잡았다",
                            "https://www.hankyung.com/it/article/2025020600001"
                    },
                    {
                            "에이럭스 'DJI 제재는 호재…美점유율 확대'",
                            "https://www.hankyung.com/it/article/2025020600002"
                    },
                    {
                            "'국민 선풍기' 신일전자, 여행용 가방시장 진출",
                            "https://www.hankyung.com/it/article/2025020600003"
                    },
                    // 5일 전 뉴스
                    {
                            "흔들리는 디지털플랫폼정부… 'AI정부 10년 뒤져'",
                            "https://www.dt.co.kr/contents.html?article_no=2025020502109931054001"
                    },
                    {
                            "'김태희도 먹는대' 불티나게 팔리더니…3년 만에 '잭팟'",
                            "https://www.hankyung.com/it/article/2025020500001"
                    },
                    {
                            "R&D 환수금 미납부땐 불이익 받는다",
                            "https://www.sedaily.com/NewsView/0000001"
                    },
                    // 6일 전 뉴스
                    {
                            "그라비티, 중국 킹넷과 '노부나가의 야망 천하로의 길' 일본 퍼블리싱 계약 체결",
                            "https://zdnet.co.kr/view/?no=20250204000001"
                    },
                    {
                            "'테호' 등장 이후 확 바뀐 발로란트 요원 메타",
                            "https://www.gametoc.co.kr/news/articleView.html?idxno=0000001"
                    },
                    {
                            "넥슨 '카스온라인', 이용자와 함께한 '대운동회 윈터 캠퍼스' 마무리",
                            "https://www.mk.co.kr/news/it/0000002"
                    },
                    // 7일 전 뉴스
                    {
                            "달 탐사선 '다누리'…임무 기간 2년 연장한다",
                            "https://www.kookje.co.kr/news2011/asp/newsbody.asp?code=0000&key=20250203000001"
                    },
                    {
                            "[오늘의 천체사진] 노르웨이 하늘 위 오로라",
                            "https://biz.chosun.com/science/0000001"
                    },
                    {
                            "우리 인공태양 KSTAR 해외 연구진도 주목…해외發 제안 실험 2배↑",
                            "https://www.etnews.com/20250203000001"
                    }
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
                    .title("Spring Boot 기본 강의 공유")
                    .content("Spring Boot에 대한 기본 개념과 실습 강의를 공유합니다.")
                    .tag("Spring,학습")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardList.add(Board.builder()
                    .user(user1)
                    .boardType(legendType)
                    .title("명예의 전당 - 이달의 MVP")
                    .content("이번 달 가장 많은 추천을 받은 게시글을 소개합니다.")
                    .tag("명예,추천")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardList.add(Board.builder()
                    .user(user1)
                    .boardType(qnaType)
                    .title("Spring Boot 배포 시 발생하는 문제")
                    .content("Spring Boot 프로젝트를 AWS에 배포하는 과정에서 오류가 발생했습니다. 해결 방법이 있을까요?")
                    .tag("Spring,배포,에러")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardList.add(Board.builder()
                    .user(user1)
                    .boardType(bulletinType)
                    .title("자유 게시판 첫 글")
                    .content("자유롭게 이야기를 나누는 공간입니다. 첫 글을 남겨봅니다!")
                    .tag("자유,소통")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardList.add(Board.builder()
                    .user(user1)
                    .boardType(ssagumanType)
                    .title("웃긴 개발 밈 모음")
                    .content("개발자들이 공감할 수 있는 재미있는 밈을 모아봤습니다.")
                    .tag("개발자,유머")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            // Board 더미 데이터 생성 - user2 (변경된 내용 적용)
            boardList.add(Board.builder()
                    .user(user2)
                    .boardType(legendType)
                    .title("SQL 최적화 기법 공유")
                    .content("데이터베이스 성능을 향상시키는 SQL 최적화 기법을 공유합니다.")
                    .tag("SQL,DB,최적화")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardList.add(Board.builder()
                    .user(user2)
                    .boardType(legendType)
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
                    .title("새로운 개발 트렌드 소개")
                    .content("최근 떠오르는 개발 트렌드에 대해 공유하고 싶은데, 어떤 기술이 인기가 많나요?")
                    .tag("트렌드,개발")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardList.add(Board.builder()
                    .user(user2)
                    .boardType(ssagumanType)
                    .title("프로그래머의 일상 만화")
                    .content("프로그래머의 일상을 재미있게 표현한 만화입니다. 한번 보고 가세요!")
                    .tag("개발자,일상,유머")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            // 추가 Board 더미 데이터 생성 - user1
            boardList.add(Board.builder()
                    .user(user1)
                    .boardType(legendType)
                    .title("Spring Security 기초")
                    .content("Spring Security를 활용한 인증 및 권한 부여 방법을 소개합니다.")
                    .tag("Spring,Security,인증")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardList.add(Board.builder()
                    .user(user1)
                    .boardType(qnaType)
                    .title("MySQL과 PostgreSQL 중 선택 고민")
                    .content("대규모 트래픽 환경에서 MySQL과 PostgreSQL 중 어떤 것을 선택하는 것이 좋을까요?")
                    .tag("MySQL,PostgreSQL,DB")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardList.add(Board.builder()
                    .user(user1)
                    .boardType(ssagumanType)
                    .title("개발자들이 공감하는 버그 유형")
                    .content("개발하면서 가장 많이 겪는 버그 유형을 공유합니다.")
                    .tag("개발자,버그,공감")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            // 추가 Board 더미 데이터 생성 - user2
            boardList.add(Board.builder()
                    .user(user2)
                    .boardType(legendType)
                    .title("이달의 인기 오픈소스 프로젝트")
                    .content("이번 달 가장 많은 스타를 받은 오픈소스 프로젝트들을 소개합니다.")
                    .tag("오픈소스,인기,GitHub")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardList.add(Board.builder()
                    .user(user2)
                    .boardType(qnaType)
                    .title("Kafka vs RabbitMQ 성능 비교")
                    .content("대량의 데이터를 처리할 때 Kafka와 RabbitMQ 중 어느 것이 더 유리한가요?")
                    .tag("Kafka,RabbitMQ,메시지큐")
                    .createdAt(now)
                    .updatedAt(now)
                    .build());

            boardList.add(Board.builder()
                    .user(user2)
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
    public void initializeComments(CommentRepository commentRepository, BoardRepository boardRepository, UserRepository userRepository) {
        if (commentRepository.count() == 0) {
            List<Comment> commentList = new ArrayList<>();
            LocalDateTime now = LocalDateTime.now();
            Random random = new Random();

            // 모든 게시글 가져오기
            List<Board> boards = boardRepository.findAll();
            if (boards.isEmpty()) {
                System.out.println("No board data found. Initialize boards first.");
                return;
            }

            // 모든 사용자 가져오기
            List<User> users = userRepository.findAll();
            if (users.isEmpty()) {
                System.out.println("No user data found. Initialize users first.");
                return;
            }

            // 각 게시글에 3~5개의 랜덤 댓글 생성
            for (Board board : boards) {
                int commentCount = random.nextInt(3) + 3; // 3~5개 댓글 생성

                for (int i = 0; i < commentCount; i++) {
                    User randomUser = users.get(random.nextInt(users.size())); // 랜덤 사용자 선택

                    Comment comment = Comment.builder()
                            .user(randomUser)
                            .board(board)
                            .parent(null) // 기본적으로 부모 없는 댓글(최상위 댓글)
                            .content("이 게시글에 대한 댓글입니다! 댓글 번호: " + (i + 1))
                            .createdAt(now.minusDays(random.nextInt(10))) // 최근 10일 내 랜덤 날짜 설정
                            .updatedAt(now)
                            .disclosure(true)
                            .build();

                    commentList.add(comment);
                }
            }

            // 데이터 저장
            commentRepository.saveAll(commentList);
            System.out.println("Default comment data added.");
        } else {
            System.out.println("Comment data already exists.");
        }
    }

    @Transactional
    public void initializeReplies(CommentRepository commentRepository, UserRepository userRepository) {
        if (commentRepository.count() > 0) {
            List<Comment> allComments = commentRepository.findAll(); // 기존 댓글 불러오기
            List<User> users = userRepository.findAll();
            Random random = new Random();

            List<Comment> replyList = new ArrayList<>();
            LocalDateTime now = LocalDateTime.now();

            // 기존 댓글 중 일부를 부모로 하여 대댓글 추가
            for (Comment parentComment : allComments) {
                if (random.nextBoolean()) { // 50% 확률로 대댓글 생성
                    User randomUser = users.get(random.nextInt(users.size())); // 랜덤 사용자 선택

                    Comment reply = Comment.builder()
                            .user(randomUser)
                            .board(parentComment.getBoard())
                            .parent(parentComment) // 부모 댓글 설정 (깊이 1)
                            .content("대댓글입니다! 부모 댓글 ID: " + parentComment.getId())
                            .createdAt(now.minusDays(random.nextInt(5))) // 최근 5일 내 랜덤 날짜 설정
                            .updatedAt(now)
                            .disclosure(true)
                            .build();

                    replyList.add(reply);
                }
            }

            // 대댓글 저장
            if (!replyList.isEmpty()) {
                commentRepository.saveAll(replyList);
                System.out.println("Default reply comment data added.");
            }
        } else {
            System.out.println("No parent comments found. Initialize comments first.");
        }
    }

    @Transactional
    public void initializeSprints(SprintRepository sprintRepository, CategoryRepository categoryRepository, SprintCategoryRepository sprintCategoryRepository) {
        if (sprintRepository.count() == 0) {
            List<Category> lowestLevelCategories = categoryRepository.findLowestLevelCategories();
            Random random = new Random();

            for (Category category : lowestLevelCategories) {
                for (int i = 0; i < 3; i++) { // 각 최하위 카테고리당 3개의 스프린트 생성
                    Sprint sprint = SprintBuilder.builder()
                            .name(category.getCategoryName() + " Sprint " + (i + 1))
                            .basicDescription("학습 내용: " + category.getCategoryName())
                            .detailDescription(category.getCategoryName() + " 관련 프로젝트와 실습")
                            .recommendedFor("이 주제에 관심 있는 개발자")
                            .startAt(LocalDateTime.now().minusDays(random.nextInt(10)))
                            .endAt(LocalDateTime.now().plusDays(random.nextInt(20) + 10))
                            .announceAt(LocalDateTime.now())
                            .maxMembers(5 + random.nextInt(5))
                            .build();
                    sprintRepository.save(sprint);
                    sprintCategoryRepository.save(new SprintCategory(sprint, category));
                }
            }
            System.out.println("✅ 최하위 카테고리 기반 스프린트 더미 데이터가 추가되었습니다.");
        } else {
            System.out.println("✅ 스프린트 데이터가 이미 존재합니다.");
        }
    }

//    @Transactional
//    public void initializeSprints(SprintRepository sprintRepository, CategoryRepository categoryRepository, SprintCategoryRepository sprintCategoryRepository) {
//        if (sprintRepository.count() == 0) {
//            List<Sprint> sprints = new ArrayList<>();
//            List<SprintCategory> sprintCategories = new ArrayList<>();
//            LocalDateTime now = LocalDateTime.now();
//            Category spring = categoryRepository.findByCategoryName("Spring")
//                    .orElseThrow(() -> new RuntimeException("Spring 카테고리가 없습니다."));
//            Category react = categoryRepository.findByCategoryName("React")
//                    .orElseThrow(() -> new RuntimeException("React 카테고리가 없습니다."));
//            Category nodejs = categoryRepository.findByCategoryName("Node.js")
//                    .orElseThrow(() -> new RuntimeException("Node.js 카테고리가 없습니다."));
//            Category nestjs = categoryRepository.findByCategoryName("NestJS")
//                    .orElseThrow(() -> new RuntimeException("NestJS 카테고리가 없습니다."));
//
//            Object[][] sprintData = {
//                    // Spring 관련 스프린트
//                    {"Spring Boot 입문", "Spring Boot 개념과 REST API 구축", "초급 백엔드 개발자", spring},
//                    {"Spring Security 실전", "JWT와 OAuth2를 활용한 인증 시스템", "보안이 필요한 백엔드 개발자", spring},
//                    {"Spring Batch", "대량 데이터 처리 및 스케줄링", "백엔드 시스템 설계자", spring},
//
//                    // React 관련 스프린트
//                    {"React 기본", "React의 useState, useEffect 이해", "초급 프론트엔드 개발자", react},
//                    {"React Router", "SPA에서의 페이지 이동 및 라우팅", "SPA 개발자", react},
//                    {"React 상태관리", "Redux 및 Context API 학습", "프론트엔드 최적화", react},
//
//                    // Node.js 관련 스프린트
//                    {"Node.js Express", "Express.js 기반 REST API 개발", "Node.js를 배우는 개발자", nodejs},
//                    {"Node.js Async", "비동기 프로그래밍 및 이벤트 루프", "고성능 서버 개발자", nodejs},
//                    {"GraphQL with Node.js", "GraphQL API 개발 및 Apollo 사용", "GraphQL 기반 API 개발자", nodejs},
//
//                    // NestJS 관련 스프린트
//                    {"NestJS 기본", "NestJS의 기본 개념과 모듈화 학습", "Node.js와 TypeScript 기반 개발자", nestjs},
//                    {"NestJS REST API", "REST API 설계 및 데이터베이스 연동", "백엔드 API 설계자", nestjs},
//                    {"NestJS Microservices", "RabbitMQ, Kafka를 활용한 마이크로서비스 구축", "대규모 시스템 개발자", nestjs}
//            };
//            for(Object[] sprintInfo : sprintData){
//                Sprint sprint = SprintBuilder.builder()
//                        .name((String) sprintInfo[0])
//                        .basicDescription((String) sprintInfo[1])
//                        .detailDescription((String) sprintInfo[1] + " 실습 포함")
//                        .recommendedFor((String) sprintInfo[2])
//                        .startAt(now.minusDays(7))
//                        .endAt(now.minusDays(6))
//                        .announceAt(now)
//                        .maxMembers(10)
//                        .build();
//                sprints.add(sprint);
//
//                // 📌 스프린트 - 카테고리 매핑
//                Category category = (Category) sprintInfo[3];
//                SprintCategory sprintCategory = new SprintCategory(sprint, category);
//                sprintCategories.add(sprintCategory);
//            }
//            sprintRepository.saveAll(sprints);
//            sprintCategoryRepository.saveAll(sprintCategories);
////            Sprint sprint1 = SprintBuilder.builder()
////                    .name("React Sprint")
////                    .basicDescription("React 기본 개념 학습")
////                    .detailDescription("React의 useState, useEffect 및 Component 설계 학습")
////                    .recommendedFor("초급 프론트엔드 개발자")
////                    .startAt(LocalDateTime.now().minusDays(7))
////                    .endAt(LocalDateTime.now().minusDays(6))
////                    .announceAt(LocalDateTime.now())
////                    .maxMembers(10)
////                    .build();
////
////            Sprint sprint2 = SprintBuilder.builder()
////                    .name("Spring Boot Sprint")
////                    .basicDescription("Spring Boot API 개발")
////                    .detailDescription("Spring Boot를 활용한 REST API 설계 및 JPA 활용 학습")
////                    .recommendedFor("초급 백엔드 개발자")
////                    .startAt(LocalDateTime.now().minusDays(7))
////                    .endAt(LocalDateTime.now().minusDays(6))
////                    .announceAt(LocalDateTime.now())
////                    .maxMembers(8)
////                    .build();
////
////            Sprint sprint3 = SprintBuilder.builder()
////                    .name("DevOps Sprint")
////                    .basicDescription("CI/CD 및 Kubernetes 학습")
////                    .detailDescription("Jenkins, Docker, Kubernetes를 활용한 배포 자동화 학습")
////                    .recommendedFor("클라우드 및 인프라 엔지니어 지망생")
////                    .startAt(LocalDateTime.now().minusDays(7))
////                    .endAt(LocalDateTime.now().minusDays(6))
////                    .announceAt(LocalDateTime.now())
////                    .maxMembers(6)
////                    .build();
////
////            sprintRepository.saveAll(List.of(sprint1, sprint2, sprint3));
//            System.out.println("✅ 스프린트 더미 데이터가 추가되었습니다.");
//        } else {
//            System.out.println("✅ 스프린트 데이터가 이미 존재합니다.");
//        }
//    }

    @Transactional
    public void initializeTeams(SprintRepository sprintRepository, TeamRepository teamRepository, UserRepository userRepository, UserTeamRepository userTeamRepository) {
        if (teamRepository.count() == 0) {
            List<Sprint> sprints = sprintRepository.findAllWithTeams();
            List<User> users = userRepository.findAllWithUserTeams();
            List<Team> teams = new ArrayList<>();

            for (User user : users) {
                // 랜덤한 스프린트 배정 (스프린트가 존재할 경우)
                if (!sprints.isEmpty()) {
                    Sprint assignedSprint = sprints.get(new Random().nextInt(sprints.size()));

                    // SprintTeamBuilder를 활용하여 팀 생성
                    Team team = SprintTeamBuilder.builder()
                            .addUser(user)
                            .participateSprint(assignedSprint)
                            .build();

                    teams.add(team);
                }
            }

            teamRepository.saveAll(teams);

            System.out.println("✅ SprintTeamBuilder를 이용한 1인 팀 및 스프린트 배정 완료");
        } else {
            System.out.println("✅ 팀 데이터가 이미 존재합니다.");
        }
    }


}
