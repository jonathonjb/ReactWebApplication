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

export const KNIGHT_MOVES = [-17, -15, -10, -6, 6, 10, 15, 17];
export const STRAIGHT_SLIDERS = [-8, -1, 1, 8];
export const DIAGONAL_SLIDERS = [-9, -7, 7, 9];