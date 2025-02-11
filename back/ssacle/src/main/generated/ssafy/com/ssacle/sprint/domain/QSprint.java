package ssafy.com.ssacle.sprint.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSprint is a Querydsl query type for Sprint
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSprint extends EntityPathBase<Sprint> {

    private static final long serialVersionUID = 842843164L;

    public static final QSprint sprint = new QSprint("sprint");

    public final DateTimePath<java.time.LocalDateTime> announceAt = createDateTime("announceAt", java.time.LocalDateTime.class);

    public final StringPath basicDescription = createString("basicDescription");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> currentMembers = createNumber("currentMembers", Integer.class);

    public final ListPath<ssafy.com.ssacle.todo.domain.DefaultTodo, ssafy.com.ssacle.todo.domain.QDefaultTodo> defaultTodos = this.<ssafy.com.ssacle.todo.domain.DefaultTodo, ssafy.com.ssacle.todo.domain.QDefaultTodo>createList("defaultTodos", ssafy.com.ssacle.todo.domain.DefaultTodo.class, ssafy.com.ssacle.todo.domain.QDefaultTodo.class, PathInits.DIRECT2);

    public final StringPath detailDescription = createString("detailDescription");

    public final DateTimePath<java.time.LocalDateTime> endAt = createDateTime("endAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> maxMembers = createNumber("maxMembers", Integer.class);

    public final StringPath name = createString("name");

    public final StringPath recommendedFor = createString("recommendedFor");

    public final NumberPath<Integer> sequence = createNumber("sequence", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> startAt = createDateTime("startAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> status = createNumber("status", Integer.class);

    public final StringPath tags = createString("tags");

    public final ListPath<ssafy.com.ssacle.team.domain.Team, ssafy.com.ssacle.team.domain.QTeam> teams = this.<ssafy.com.ssacle.team.domain.Team, ssafy.com.ssacle.team.domain.QTeam>createList("teams", ssafy.com.ssacle.team.domain.Team.class, ssafy.com.ssacle.team.domain.QTeam.class, PathInits.DIRECT2);

    public QSprint(String variable) {
        super(Sprint.class, forVariable(variable));
    }

    public QSprint(Path<? extends Sprint> path) {
        super(path.getType(), path.getMetadata());
    }

    public QSprint(PathMetadata metadata) {
        super(Sprint.class, metadata);
    }

}

