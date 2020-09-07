const Consts = require('./ServerConstants')

const positionStatus = (color, position, board) => {
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

const isOpposingKnight = (color, position, board) => {
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

const isOpposingDiagonalSliderPiece = (color, position, board) => {
    return isOpposingBishop(color, position, board) || isOpposingQueen(color, position, board);
}

const isOpposingStraightSliderPiece = (color, position, board) => {
    return isOpposingRook(color, position, board) || isOpposingQueen(color, position, board);
}

const isOpposingPawn = (color, position, board) => {
    return color === Consts.WHITE ? board[position] === Consts.BLACK_PAWN : board[position] === Consts.WHITE_PAWN;
}

const getKingPosition = (color, board) => {
    let king = color === Consts.WHITE ? Consts.WHITE_KING : Consts.BLACK_KING;
    for(let i = 0; i < 64; i++){
        if(board[i] === king){
            return i;
        }
    }
    console.error('Cannot find king piece on the board.')
}

const getOpposingColor = (color) => {
    return color === Consts.WHITE ? Consts.BLACK : Consts.WHITE;
}

const checkIfOneSpaceMove = (startPosition, endPosition) => {
    // the reason why I use '2' here instead of '1' is because while 2 spaces aren't technically 'one space moves', it represents a 
    //valid knight move. None of the invalid moves, which moves a piece across the board, contains a move which moves a piece across only
    //two columns, so this will work; it will only return true if the 'single' move is legal.
    return Math.abs((startPosition % 8) - (endPosition % 8)) <= 2;
}

const forwardValue = (color) => {
    return color === Consts.WHITE ? 8 : -8;
}

const pawnAtStartRow = (color, position) => {
    return color === Consts.WHITE ? position >= 8 && position < 16 : position >= 48 && position < 55;
}

const isTeamsPawn = (color, position, board) => {
    return color === Consts.WHITE ? board[position] === Consts.WHITE_PAWN : board[position] === Consts.BLACK_PAWN;
}

const isTeamsBishop = (color, position, board) => {
    return color === Consts.WHITE ? board[position] === Consts.WHITE_BISHOP : board[position] === Consts.BLACK_BISHOP;
}

const isTeamsKnight = (color, position, board) => {
    return color === Consts.WHITE ? board[position] === Consts.WHITE_KNIGHT : board[position] === Consts.BLACK_KNIGHT;
}

const isTeamsRook = (color, position, board) => {
    return color === Consts.WHITE ? board[position] === Consts.WHITE_ROOK : board[position] === Consts.BLACK_ROOK;
}

const isTeamsQueen = (color, position, board) => {
    return color === Consts.WHITE ? board[position] === Consts.WHITE_QUEEN : board[position] === Consts.BLACK_QUEEN;
}

const isTeamsKing = (color, position, board) => {
    return color === Consts.WHITE ? board[position] === Consts.WHITE_KING : board[position] === Consts.BLACK_KING;
}

const printBoard = (board) => {
    let i = 0; 
    for(let row = 0; row < 8; row++){
        let rowString = []
        for(let col = 0; col < 8; col++){
            switch(board[i]){
                case Consts.WHITE_PAWN:
                    rowString.push('W PAWN');
                    break;
                case Consts.WHITE_KNIGHT:
                    rowString.push('W KNIGHT');
                    break;
                case Consts.WHITE_BISHOP:
                    rowString.push('W BISHOP');
                    break;
                case Consts.WHITE_ROOK:
                    rowString.push('W ROOK');
                    break;
                case Consts.WHITE_QUEEN:
                    rowString.push('W QUEEN');
                    break;
                case Consts.WHITE_KING:
                    rowString.push('W KING');
                    break;
                case Consts.BLACK_PAWN:
                    rowString.push('B PAWN');
                    break;
                case Consts.BLACK_KNIGHT:
                    rowString.push('B KNIGHT');
                    break;
                case Consts.BLACK_BISHOP:
                    rowString.push('B BISHOP');
                    break;
                case Consts.BLACK_ROOK:
                    rowString.push('B ROOK');
                    break;
                case Consts.BLACK_QUEEN:
                    rowString.push('B QUEEN');
                    break;
                case Consts.BLACK_KING:
                    rowString.push('B KING');
                    break;
                default:
                    rowString.push('_' + i + '_');
            }
            i++;
        }
        console.log(rowString);
    }
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

module.exports = {
    printBoard,
    isTeamsKing,
    isTeamsQueen,
    isTeamsKnight,
    isTeamsPawn,
    isTeamsRook,
    isTeamsBishop,
    pawnAtStartRow,
    forwardValue,
    checkIfOneSpaceMove,
    getOpposingColor,
    getKingPosition,
    isOpposingDiagonalSliderPiece,
    isOpposingStraightSliderPiece,
    isOpposingPawn,
    isOpposingKnight,
    positionStatus
}