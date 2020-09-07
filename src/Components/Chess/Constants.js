export const NONE = 'a';
export const WHITE_PAWN = 'b';
export const WHITE_KNIGHT = 'c';
export const WHITE_BISHOP = 'd';
export const WHITE_ROOK = 'e';
export const WHITE_QUEEN = 'f';
export const WHITE_KING = 'g';
export const BLACK_PAWN = 'h';
export const BLACK_KNIGHT = 'i';
export const BLACK_BISHOP = 'j';
export const BLACK_ROOK = 'k';
export const BLACK_QUEEN = 'l';
export const BLACK_KING = 'm';

export const BLACK = 'o';
export const WHITE = 'p';

export const STATUS_NONE = 'q';
export const STATUS_SAME_COLOR = 'r';
export const STATUS_DIFF_COLOR = 's';
export const STATUS_OUT_OF_BOUNDS = 't';

export const START_POS = [
    WHITE_ROOK, WHITE_KNIGHT, WHITE_BISHOP, WHITE_KING, WHITE_QUEEN, WHITE_BISHOP, WHITE_KNIGHT, WHITE_ROOK, 
    WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN,
    NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE,
    NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE,
    NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE,
    NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE,
    BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN,
    BLACK_ROOK, BLACK_KNIGHT, BLACK_BISHOP, BLACK_KING, BLACK_QUEEN, BLACK_BISHOP, BLACK_KNIGHT, BLACK_ROOK
]

export const START_CASTLING_CODE = [true, true, true, true];

export const TEST_POS = [
    NONE, NONE, NONE, WHITE_KING, NONE, NONE, NONE, NONE, 
    NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE,
    NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE,
    NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE,
    NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE,
    NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE,
    NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE,
    NONE, NONE, NONE, BLACK_KING, NONE, NONE, NONE, NONE
]

export const TEST_CASTLING_CODE = [false, false, false, false];

export const NORTH = 8;
export const NORTHWEST = 7;
export const NORTHEAST = 9;
export const EAST = -1;
export const WEST = 1;
export const SOUTHWEST = -9;
export const SOUTH = -8;
export const SOUTHEAST = -7;

export const KNIGHT_MOVES = [-17, -15, -10, -6, 6, 10, 15, 17];

// The reason why we need to keep them in this order is because when checking for pins, we move the king slider using the opposite move
// as the opposing piece slider. Ex: Sliding piece goes NORTH, King goes SOUTH. If they both end up at the same piece, that 
// piece is pinned. The piece loops from start to last, while the king loops from last to start

export const STRAIGHT_SLIDERS = [SOUTH, WEST, EAST, NORTH]; // KEEP IT IN THIS ORDER
export const DIAGONAL_SLIDERS = [SOUTHWEST, SOUTHEAST, NORTHWEST, NORTHEAST]; // KEEP IT IN THIS ORDER

export const KING_MOVES = [NORTH, NORTHWEST, NORTHEAST, EAST, WEST, SOUTHWEST, SOUTH, SOUTHEAST];