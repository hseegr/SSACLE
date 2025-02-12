package ssafy.com.ssacle.lunch.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QLunch is a Querydsl query type for Lunch
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QLunch extends EntityPathBase<Lunch> {

    private static final long serialVersionUID = -1645145360L;

    public static final QLunch lunch = new QLunch("lunch");

    public final DateTimePath<java.time.LocalDateTime> day = createDateTime("day", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath imageUrl = createString("imageUrl");

    public final StringPath menuName = createString("menuName");

    public final ListPath<ssafy.com.ssacle.vote.domain.Vote, ssafy.com.ssacle.vote.domain.QVote> votes = this.<ssafy.com.ssacle.vote.domain.Vote, ssafy.com.ssacle.vote.domain.QVote>createList("votes", ssafy.com.ssacle.vote.domain.Vote.class, ssafy.com.ssacle.vote.domain.QVote.class, PathInits.DIRECT2);

    public QLunch(String variable) {
        super(Lunch.class, forVariable(variable));
    }

    public QLunch(Path<? extends Lunch> path) {
        super(path.getType(), path.getMetadata());
    }

    public QLunch(PathMetadata metadata) {
        super(Lunch.class, metadata);
    }

}

