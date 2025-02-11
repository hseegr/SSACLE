package ssafy.com.ssacle.ainews.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QAINews is a Querydsl query type for AINews
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QAINews extends EntityPathBase<AINews> {

    private static final long serialVersionUID = 1738288158L;

    public static final QAINews aINews = new QAINews("aINews");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath title = createString("title");

    public final StringPath url = createString("url");

    public QAINews(String variable) {
        super(AINews.class, forVariable(variable));
    }

    public QAINews(Path<? extends AINews> path) {
        super(path.getType(), path.getMetadata());
    }

    public QAINews(PathMetadata metadata) {
        super(AINews.class, metadata);
    }

}

