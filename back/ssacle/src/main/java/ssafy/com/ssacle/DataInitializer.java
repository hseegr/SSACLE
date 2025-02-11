package ssafy.com.ssacle;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;
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
import ssafy.com.ssacle.user.domain.User;
import ssafy.com.ssacle.user.exception.CannotLoginException;
import ssafy.com.ssacle.user.exception.LoginErrorCode;
import ssafy.com.ssacle.user.repository.UserRepository;
import ssafy.com.ssacle.usercategory.domain.UserCategory;
import ssafy.com.ssacle.usercategory.repository.UserCategoryRepository;

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
            LunchRepository lunchRepository) {

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
        };
    }

    @Transactional
    public void initializeUsers(UserRepository userRepository) {
        if (userRepository.count() == 0) { // 기존 데이터가 없을 경우에만 추가
            User admin = User.createAdmin("admin@example.com", "admin123", "AdminUser");
            User admin2 = User.createAdmin("admin2@example.com", "admin1234", "AdminUser2");
            User user = User.createStudent("user@example.com", "user123", "John Doe", "1234567", "johndoe");
            userRepository.save(admin);
            userRepository.save(admin2);
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
            Category backEnd = Category.builder()
                    .categoryName("Back-end")
                    .build();

            Category frontEnd = Category.builder()
                    .categoryName("Front-end")
                    .build();

            Category infra = Category.builder()
                    .categoryName("Infra")
                    .build();

            Category database = Category.builder()
                    .categoryName("DataBase")
                    .build();

            categoryRepository.save(backEnd);
            categoryRepository.save(frontEnd);
            categoryRepository.save(infra);
            categoryRepository.save(database);

            // Back-end 하위 카테고리
            List<Category> backEndChildren = List.of(
                    Category.builder().categoryName("Spring").parent(backEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/Spring.jpeg").build(),
                    Category.builder().categoryName("Django").parent(backEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/django.png").build(),
                    Category.builder().categoryName("Node.js").parent(backEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/node.png").build(),
                    Category.builder().categoryName("NestJS").parent(backEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/nest.png").build(),
                    Category.builder().categoryName("Ruby on Rails").parent(backEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/ruby.png").build(),
                    Category.builder().categoryName("ASP.NET").parent(backEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/asp.png").build()
            );

            // Front-end 하위 카테고리
            List<Category> frontEndChildren = List.of(
                    Category.builder().categoryName("React").parent(frontEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/react.png").build(),
                    Category.builder().categoryName("Vue.js").parent(frontEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/vue.png").build(),
                    Category.builder().categoryName("Angular").parent(frontEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/angular.png").build(),
                    Category.builder().categoryName("Svelte").parent(frontEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/svelte.png").build(),
                    Category.builder().categoryName("Next.js").parent(frontEnd).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/next.png").build()

            );

            // Infra 하위 카테고리
            List<Category> infraChildren = List.of(
                    Category.builder().categoryName("Docker").parent(infra).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/docker.png").build(),
                    Category.builder().categoryName("Kubernetes").parent(infra).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/kuber.png").build(),
                    Category.builder().categoryName("AWS").parent(infra).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/aws.png").build(),
                    Category.builder().categoryName("Azure").parent(infra).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/azure.jpeg").build(),
                    Category.builder().categoryName("Google Cloud").parent(infra).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/google+cloud.png").build()
            );

            // DataBase 하위 카테고리
            List<Category> databaseChildren = List.of(
                    Category.builder().categoryName("MySQL").parent(database).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/mysql.png").build(),
                    Category.builder().categoryName("PostgreSQL").parent(database).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/postgresql.png").build(),
                    Category.builder().categoryName("MongoDB").parent(database).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/mongodb.png").build(),
                    Category.builder().categoryName("Redis").parent(database).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/redis.png").build(),
                    Category.builder().categoryName("Oracle").parent(database).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/oracle.png").build(),
                    Category.builder().categoryName("MariaDB").parent(database).image("https://ssacle.s3.ap-northeast-2.amazonaws.com/image/category/mariadb.png").build()
            );

            // 모든 카테고리 저장
            categoryRepository.saveAll(backEndChildren);
            categoryRepository.saveAll(frontEndChildren);
            categoryRepository.saveAll(infraChildren);
            categoryRepository.saveAll(databaseChildren);

            System.out.println("Default category data added");
        } else {
            System.out.println("Default category data already exists");
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
            BoardType eduType = boardTypeRepository.findByName("edu").orElseThrow(()->new BoardException(BoardErrorCode.BOARDTYPE_NOT_FOUND));
            BoardType freeType = boardTypeRepository.findByName("free").orElseThrow(()->new BoardException(BoardErrorCode.BOARDTYPE_NOT_FOUND));
            BoardType legendType = boardTypeRepository.findByName("legend").orElseThrow(()->new BoardException(BoardErrorCode.BOARDTYPE_NOT_FOUND));
            BoardType qnaType = boardTypeRepository.findByName("qna").orElseThrow(()->new BoardException(BoardErrorCode.BOARDTYPE_NOT_FOUND));
            BoardType bulletinType = boardTypeRepository.findByName("bulletin").orElseThrow(()->new BoardException(BoardErrorCode.BOARDTYPE_NOT_FOUND));
            BoardType ssagumanType = boardTypeRepository.findByName("ssaguman").orElseThrow(()->new BoardException(BoardErrorCode.BOARDTYPE_NOT_FOUND));


            // Board 더미 데이터 생성 - user1
            boardList.add(Board.builder()
                    .user(user1)
                    .boardType(eduType)
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
                    .boardType(eduType)
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
                    .boardType(eduType)
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

}
