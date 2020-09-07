import * as Consts from './Constants';

export const positionStatus = (color, position, board) => {
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

export const isOpposingKnight = (color, position, board) => {
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

export const isOpposingDiagonalSliderPiece = (color, position, board) => {
    return isOpposingBishop(color, position, board) || isOpposingQueen(color, position, board);
}

export const isOpposingStraightSliderPiece = (color, position, board) => {
    return isOpposingRook(color, position, board) || isOpposingQueen(color, position, board);
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

export const getOpposingColor = (color) => {
    return color === Consts.WHITE ? Consts.BLACK : Consts.WHITE;
}

export const checkIfOneSpaceMove = (startPosition, endPosition) => {
    // the reason why I use '2' here instead of '1' is because while 2 spaces aren't technically 'one space moves', it represents a 
    //valid knight move. None of the invalid moves, which moves a piece across the board, contains a move which moves a piece across only
    //two columns, so this will work; it will only return true if the 'single' move is legal.
    return Math.abs((startPosition % 8) - (endPosition % 8)) <= 2;
}

export const forwardValue = (color) => {
    return color === Consts.WHITE ? 8 : -8;
}

export const pawnAtStartRow = (color, position) => {
    return color === Consts.WHITE ? position >= 8 && position < 16 : position >= 48 && position < 55;
}

export const isTeamsPawn = (color, position, board) => {
    return color === Consts.WHITE ? board[position] === Consts.WHITE_PAWN : board[position] === Consts.BLACK_PAWN;
}

export const isTeamsBishop = (color, position, board) => {
    return color === Consts.WHITE ? board[position] === Consts.WHITE_BISHOP : board[position] === Consts.BLACK_BISHOP;
}

export const isTeamsKnight = (color, position, board) => {
    return color === Consts.WHITE ? board[position] === Consts.WHITE_KNIGHT : board[position] === Consts.BLACK_KNIGHT;
}

export const isTeamsRook = (color, position, board) => {
    return color === Consts.WHITE ? board[position] === Consts.WHITE_ROOK : board[position] === Consts.BLACK_ROOK;
}

export const isTeamsQueen = (color, position, board) => {
    return color === Consts.WHITE ? board[position] === Consts.WHITE_QUEEN : board[position] === Consts.BLACK_QUEEN;
}

export const isTeamsKing = (color, position, board) => {
    return color === Consts.WHITE ? board[position] === Consts.WHITE_KING : board[position] === Consts.BLACK_KING;
}


const isOpposingBishop = (color, position, board) => {
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

const isOpposingRook = (color, position, board) => {
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

const isOpposingQueen = (color, position, board) => {
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
