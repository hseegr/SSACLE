package ssafy.com.ssacle.todo.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDefaultTodo is a Querydsl query type for DefaultTodo
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDefaultTodo extends EntityPathBase<DefaultTodo> {

    private static final long serialVersionUID = -427079495L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDefaultTodo defaultTodo = new QDefaultTodo("defaultTodo");

    public final StringPath content = createString("content");

    public final DatePath<java.time.LocalDate> date = createDate("date", java.time.LocalDate.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final ssafy.com.ssacle.sprint.domain.QSprint sprint;

    public QDefaultTodo(String variable) {
        this(DefaultTodo.class, forVariable(variable), INITS);
    }

    public QDefaultTodo(Path<? extends DefaultTodo> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDefaultTodo(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDefaultTodo(PathMetadata metadata, PathInits inits) {
        this(DefaultTodo.class, metadata, inits);
    }

    public QDefaultTodo(Class<? extends DefaultTodo> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.sprint = inits.isInitialized("sprint") ? new ssafy.com.ssacle.sprint.domain.QSprint(forProperty("sprint")) : null;
    }

}

