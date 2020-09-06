import * as Consts from './Constants';

export const positionStatus = (position, color, board) => {
    if(!inBound(position)){
        return Consts.STATUS_OUT_OF_BOUNDS;
    }
    let piece = board[position];
    if(piece === Consts.NONE){
        return Consts.STATUS_NONE;
    }

    let pieceColor = null;
    if(piece >= Consts.WHITE_PAWN && piece <= Consts.WHITE_KING){
        pieceColor = Consts.WHITE;
    }
    else if(piece >= Consts.BLACK_PAWN && piece <= Consts.BLACK_KING){
        pieceColor = Consts.BLACK;
    }

    if(pieceColor === color) return Consts.STATUS_SAME_COLOR;
    else return Consts.STATUS_DIFF_COLOR;
}

export const isOpposingKnight = (position, color, board) => {
    if(!inBound(position)){
        return false;
    }
    else if(color === Consts.WHITE){
        return board[position] === Consts.BLACK_KNIGHT;
    }
    else if(color === Consts.BLACK){
        return board[position] === Consts.WHITE_KNIGHT;
    }
    console.error("The color is not correctly defined");
}

export const isOpposingDiagonalSliderPiece = (position, color, board) => {
    return isOpposingBishop(position, color, board) || isOpposingQueen(position, color, board);
}

export const isOpposingStraightSliderPiece = (position, color, board) => {
    return isOpposingRook(position, color, board) || isOpposingQueen(position, color, board);
}

export const getKingPosition = (color, board) => {
    let king = color === Consts.WHITE ? Consts.WHITE_KING : Consts.BLACK_KING;
    for(let i = 0; i < 64; i++){
        if(board[i] === king){
            return i;
        }
    }
    console.error('Cannot find king piece on the board.')
}




const isOpposingBishop = (position, color, board) => {
    if(!inBound(position)){
        return false;
    }
    else if(color === Consts.WHITE){
        return board[position] === Consts.BLACK_BISHOP;
    }
    else if(color === Consts.BLACK){
        return board[position] === Consts.WHITE_BISHOP;
    }
    console.error("The color is not correctly defined");
}

const isOpposingRook = (position, color, board) => {
    if(!inBound(position)){
        return false;
    }
    else if(color === Consts.WHITE){
        return board[position] === Consts.BLACK_ROOK;
    }
    else if(color === Consts.BLACK){
        return board[position] === Consts.WHITE_ROOK;
    }
    console.error("The color is not correctly defined");
}

const isOpposingQueen = (position, color, board) => {
    if(!inBound(position)){
        return false;
    }
    else if(color === Consts.WHITE){
        return board[position] === Consts.BLACK_QUEEN;
    }
    else if(color === Consts.BLACK){
        return board[position] === Consts.WHITE_QUEEN;
    }
    console.error("The color is not correctly defined");
}

const inBound = position => {
    return position >= 0 && position < 64;
}
