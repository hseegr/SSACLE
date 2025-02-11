package ssafy.com.ssacle.team.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTeam is a Querydsl query type for Team
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTeam extends EntityPathBase<Team> {

    private static final long serialVersionUID = 1494184866L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTeam team = new QTeam("team");

    public final NumberPath<Integer> currentMembers = createNumber("currentMembers", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath name = createString("name");

    public final StringPath NotionURL = createString("NotionURL");

    public final NumberPath<Integer> point = createNumber("point", Integer.class);

    public final ssafy.com.ssacle.sprint.domain.QSprint sprint;

    public final ListPath<ssafy.com.ssacle.todo.domain.Todo, ssafy.com.ssacle.todo.domain.QTodo> todos = this.<ssafy.com.ssacle.todo.domain.Todo, ssafy.com.ssacle.todo.domain.QTodo>createList("todos", ssafy.com.ssacle.todo.domain.Todo.class, ssafy.com.ssacle.todo.domain.QTodo.class, PathInits.DIRECT2);

    public final ListPath<ssafy.com.ssacle.userteam.domain.UserTeam, ssafy.com.ssacle.userteam.domain.QUserTeam> userTeams = this.<ssafy.com.ssacle.userteam.domain.UserTeam, ssafy.com.ssacle.userteam.domain.QUserTeam>createList("userTeams", ssafy.com.ssacle.userteam.domain.UserTeam.class, ssafy.com.ssacle.userteam.domain.QUserTeam.class, PathInits.DIRECT2);

    public QTeam(String variable) {
        this(Team.class, forVariable(variable), INITS);
    }

    public QTeam(Path<? extends Team> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTeam(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTeam(PathMetadata metadata, PathInits inits) {
        this(Team.class, metadata, inits);
    }

    public QTeam(Class<? extends Team> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.sprint = inits.isInitialized("sprint") ? new ssafy.com.ssacle.sprint.domain.QSprint(forProperty("sprint")) : null;
    }

}

