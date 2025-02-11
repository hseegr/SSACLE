package ssafy.com.ssacle.board.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBoardType is a Querydsl query type for BoardType
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBoardType extends EntityPathBase<BoardType> {

    private static final long serialVersionUID = 585060298L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBoardType boardType = new QBoardType("boardType");

    public final ListPath<BoardType, QBoardType> children = this.<BoardType, QBoardType>createList("children", BoardType.class, QBoardType.class, PathInits.DIRECT2);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isLeaf = createBoolean("isLeaf");

    public final StringPath name = createString("name");

    public final QBoardType parent;

    public QBoardType(String variable) {
        this(BoardType.class, forVariable(variable), INITS);
    }

    public QBoardType(Path<? extends BoardType> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBoardType(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBoardType(PathMetadata metadata, PathInits inits) {
        this(BoardType.class, metadata, inits);
    }

    public QBoardType(Class<? extends BoardType> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.parent = inits.isInitialized("parent") ? new QBoardType(forProperty("parent"), inits.get("parent")) : null;
    }

}

