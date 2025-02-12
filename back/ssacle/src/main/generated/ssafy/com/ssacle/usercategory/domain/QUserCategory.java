package ssafy.com.ssacle.usercategory.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUserCategory is a Querydsl query type for UserCategory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUserCategory extends EntityPathBase<UserCategory> {

    private static final long serialVersionUID = 1712103322L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QUserCategory userCategory = new QUserCategory("userCategory");

    public final ssafy.com.ssacle.category.domain.QCategory category;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final ssafy.com.ssacle.user.domain.QUser user;

    public QUserCategory(String variable) {
        this(UserCategory.class, forVariable(variable), INITS);
    }

    public QUserCategory(Path<? extends UserCategory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QUserCategory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QUserCategory(PathMetadata metadata, PathInits inits) {
        this(UserCategory.class, metadata, inits);
    }

    public QUserCategory(Class<? extends UserCategory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.category = inits.isInitialized("category") ? new ssafy.com.ssacle.category.domain.QCategory(forProperty("category"), inits.get("category")) : null;
        this.user = inits.isInitialized("user") ? new ssafy.com.ssacle.user.domain.QUser(forProperty("user")) : null;
    }

}

