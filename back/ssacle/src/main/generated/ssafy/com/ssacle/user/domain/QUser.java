package ssafy.com.ssacle.user.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = 1420300670L;

    public static final QUser user = new QUser("user");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> deletedAt = createDateTime("deletedAt", java.time.LocalDateTime.class);

    public final StringPath email = createString("email");

    public final NumberPath<Integer> experience = createNumber("experience", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath is_graduate = createBoolean("is_graduate");

    public final BooleanPath isDelete = createBoolean("isDelete");

    public final NumberPath<Integer> level = createNumber("level", Integer.class);

    public final StringPath name = createString("name");

    public final StringPath nickname = createString("nickname");

    public final StringPath password = createString("password");

    public final NumberPath<Integer> pickles = createNumber("pickles", Integer.class);

    public final EnumPath<Role> role = createEnum("role", Role.class);

    public final StringPath studentNumber = createString("studentNumber");

    public final ListPath<ssafy.com.ssacle.user_team.domain.UserTeam, ssafy.com.ssacle.user_team.domain.QUserTeam> userTeam = this.<ssafy.com.ssacle.user_team.domain.UserTeam, ssafy.com.ssacle.user_team.domain.QUserTeam>createList("userTeam", ssafy.com.ssacle.user_team.domain.UserTeam.class, ssafy.com.ssacle.user_team.domain.QUserTeam.class, PathInits.DIRECT2);

    public QUser(String variable) {
        super(User.class, forVariable(variable));
    }

    public QUser(Path<? extends User> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUser(PathMetadata metadata) {
        super(User.class, metadata);
    }

}

