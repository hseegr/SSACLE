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

    public static final QTeam team = new QTeam("team");

    public final NumberPath<Integer> count = createNumber("count", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isFull = createBoolean("isFull");

    public final StringPath name = createString("name");

    public final ListPath<ssafy.com.ssacle.user_team.domain.UserTeam, ssafy.com.ssacle.user_team.domain.QUserTeam> userTeam = this.<ssafy.com.ssacle.user_team.domain.UserTeam, ssafy.com.ssacle.user_team.domain.QUserTeam>createList("userTeam", ssafy.com.ssacle.user_team.domain.UserTeam.class, ssafy.com.ssacle.user_team.domain.QUserTeam.class, PathInits.DIRECT2);

    public QTeam(String variable) {
        super(Team.class, forVariable(variable));
    }

    public QTeam(Path<? extends Team> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTeam(PathMetadata metadata) {
        super(Team.class, metadata);
    }

}

