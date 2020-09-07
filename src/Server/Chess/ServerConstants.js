const NONE = 'a';
const WHITE_PAWN = 'b';
const WHITE_KNIGHT = 'c';
const WHITE_BISHOP = 'd';
const WHITE_ROOK = 'e';
const WHITE_QUEEN = 'f';
const WHITE_KING = 'g';
const BLACK_PAWN = 'h';
const BLACK_KNIGHT = 'i';
const BLACK_BISHOP = 'j';
const BLACK_ROOK = 'k';
const BLACK_QUEEN = 'l';
const BLACK_KING = 'm';

const BLACK = 'o';
const WHITE = 'p';

const STATUS_NONE = 'q';
const STATUS_SAME_COLOR = 'r';
const STATUS_DIFF_COLOR = 's';
const STATUS_OUT_OF_BOUNDS = 't';

const START_POS = [
    WHITE_ROOK, WHITE_KNIGHT, WHITE_BISHOP, WHITE_KING, WHITE_QUEEN, WHITE_BISHOP, WHITE_KNIGHT, WHITE_ROOK, 
    WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN,
    NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE,
    NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE,
    NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE,
    NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE,
    BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN,
    BLACK_ROOK, BLACK_KNIGHT, BLACK_BISHOP, BLACK_KING, BLACK_QUEEN, BLACK_BISHOP, BLACK_KNIGHT, BLACK_ROOK
]

const START_CASTLING_CODE = [true, true, true, true];

const NORTH = 8;
const NORTHWEST = 7;
const NORTHEAST = 9;
const EAST = -1;
const WEST = 1;
const SOUTHWEST = -9;
const SOUTH = -8;
const SOUTHEAST = -7;

const KNIGHT_MOVES = [-17, -15, -10, -6, 6, 10, 15, 17];

// The reason why we need to keep them in this order is because when checking for pins, we move the king slider using the opposite move
// as the opposing piece slider. Ex: Sliding piece goes NORTH, King goes SOUTH. If they both end up at the same piece, that 
// piece is pinned. The piece loops from start to last, while the king loops from last to start

const STRAIGHT_SLIDERS = [SOUTH, WEST, EAST, NORTH]; // KEEP IT IN THIS ORDER
const DIAGONAL_SLIDERS = [SOUTHWEST, SOUTHEAST, NORTHWEST, NORTHEAST]; // KEEP IT IN THIS ORDER

const KING_MOVES = [NORTH, NORTHWEST, NORTHEAST, EAST, WEST, SOUTHWEST, SOUTH, SOUTHEAST];

module.exports = {
    KING_MOVES, 
    DIAGONAL_SLIDERS,
    STRAIGHT_SLIDERS,
    KNIGHT_MOVES,
    SOUTHEAST,
    SOUTH,
    SOUTHWEST,
    WEST,
    EAST,
    NORTHEAST,
    NORTHWEST,
    NORTH,
    START_CASTLING_CODE,
    START_POS,
    STATUS_NONE,
    STATUS_SAME_COLOR,
    STATUS_DIFF_COLOR,
    STATUS_OUT_OF_BOUNDS,
    BLACK,
    WHITE,
    NONE,
    BLACK_KING,
    BLACK_QUEEN,
    BLACK_ROOK,
    BLACK_BISHOP,
    BLACK_KNIGHT,
    BLACK_PAWN,
    WHITE_KING,
    WHITE_QUEEN,
    WHITE_ROOK,
    WHITE_BISHOP,
    WHITE_KNIGHT,
    WHITE_PAWN
}