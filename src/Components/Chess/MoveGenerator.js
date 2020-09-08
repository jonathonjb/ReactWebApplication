import * as BoardTk from './BoardToolKit';
import * as Consts from './Constants';

export const generateMoves = (color, board, castlingCodes, enPassantPos) => {
    let kingPosition = BoardTk.getKingPosition(color, board);
    let kingAttackers= getNumberOfTimesAttacked(color, kingPosition, board);
    let numOfChecks = kingAttackers[0];
    let pinnedPieces = getPinnedPieces(color, kingPosition, board);

    let generatedMoves = new Map();

    if(numOfChecks === 0){
        for(let i = 0; i < 64; i++){
            let validSquares = null;
            if(pinnedPieces.has(i)){
                validSquares = getPinnedPiecesValidSquares(color, i, kingPosition, board);
            }
            callMoveGeneratorByPiece(color, i, board, generatedMoves, validSquares, enPassantPos, castlingCodes);
        }
    }
    else if(numOfChecks === 1){
        /* find threatening piece, store its position and create a new board which marks all of the tiles that is between the king and
             the attacking piece. You may 'block' the check by moving a non pinned piece here. */

        // case 1: capturing the threatening piece - make sure the capturing piece is not absolutely pinned

        // case 2: king can move to a non-attacked square

        // case 3: block the attacking piece by moving a non-pinned piece to a 'push' tile
        
        let validSquares = getSquaresBetweenKingAndAttacker(color, kingPosition, board);
        if(validSquares === null){
            validSquares = kingAttackers[1];
        }
        for(let i = 0; i < 64; i++){
            if(!pinnedPieces.has(i)){
                if (BoardTk.isTeamsPawn(color, i, board)) { generatedMoves.set(i, generatePawnMoves(color, i, board, validSquares, enPassantPos)); }
                else if (BoardTk.isTeamsKnight(color, i, board)) { generatedMoves.set(i, generateKnightMoves(color, i, board, validSquares)); }
                else if (BoardTk.isTeamsBishop(color, i, board)) { generatedMoves.set(i, generateBishopMoves(color, i, board, validSquares)); }
                else if (BoardTk.isTeamsRook(color, i, board)) { generatedMoves.set(i, generateRookMoves(color, i, board, validSquares)); }
                else if (BoardTk.isTeamsQueen(color, i, board)) { generatedMoves.set(i, generateQueenMoves(color, i, board, validSquares)); }
                else if (BoardTk.isTeamsKing(color, i, board)) { generatedMoves.set(i, generateKingMoves(color, i, board, validSquares, castlingCodes)); }
            }
        }
    }
    else{
        // Only king moves are allowed.
        generatedMoves.set(kingPosition, generateKingMoves(color, kingPosition, board, null, castlingCodes));
    }

    return generatedMoves;
}

function callMoveGeneratorByPiece(color, i, board, generatedMoves, validSquares, enPassantPos, castlingCodes) {
    if (BoardTk.isTeamsPawn(color, i, board)) { generatedMoves.set(i, generatePawnMoves(color, i, board, validSquares, enPassantPos)); }
    else if (BoardTk.isTeamsKnight(color, i, board)) { generatedMoves.set(i, generateKnightMoves(color, i, board, validSquares)); }
    else if (BoardTk.isTeamsBishop(color, i, board)) { generatedMoves.set(i, generateBishopMoves(color, i, board, validSquares)); }
    else if (BoardTk.isTeamsRook(color, i, board)) { generatedMoves.set(i, generateRookMoves(color, i, board, validSquares)); }
    else if (BoardTk.isTeamsQueen(color, i, board)) { generatedMoves.set(i, generateQueenMoves(color, i, board, validSquares)); }
    else if (BoardTk.isTeamsKing(color, i, board)) { generatedMoves.set(i, generateKingMoves(color, i, board, validSquares, castlingCodes)); }
}

const getNumberOfTimesAttacked = (color, position, board, removeKing=false, kingPosition=null) => {
    if(removeKing){
        board[kingPosition] = Consts.NONE;
    }
    let numOfChecks = 0;
    let attackers = new Set();
    let forward = BoardTk.forwardValue(color);

    // check for pawn attacks
    if(BoardTk.checkIfOneSpaceMove(position, position + forward - 1)){
        if(BoardTk.isOpposingPawn(color, position + forward - 1, board)){
            numOfChecks++;
            attackers.add(position + forward - 1);
        }
    }
    if(BoardTk.checkIfOneSpaceMove(position, position + forward + 1)){
        if(BoardTk.isOpposingPawn(color, position + forward + 1, board)){
            numOfChecks++;
            attackers.add(position + forward + 1);
        }
    }

    Consts.KNIGHT_MOVES.forEach(move => {
        let currPosition = position + move;
        if(BoardTk.checkIfOneSpaceMove(position, currPosition) && BoardTk.isOpposingKnight(color, currPosition, board)){
            numOfChecks++;
            attackers.add(currPosition);
        }
    });
    Consts.DIAGONAL_SLIDERS.forEach(slider => {
        let prevPosition = null;
        let currPosition = position;
        do{
            prevPosition = currPosition;
            currPosition += slider;
        }
        while(BoardTk.checkIfOneSpaceMove(prevPosition, currPosition) && BoardTk.positionStatus(color, currPosition, board) === Consts.STATUS_NONE)
        if(BoardTk.checkIfOneSpaceMove(prevPosition, currPosition) && BoardTk.isOpposingDiagonalSliderPiece(color, currPosition, board)){
            numOfChecks++;
            attackers.add(currPosition);
        }
    });
    Consts.STRAIGHT_SLIDERS.forEach(slider => {
        let prevPosition = null;
        let currPosition = position;
        do{
            prevPosition = currPosition;
            currPosition += slider;
        }
        while(BoardTk.checkIfOneSpaceMove(prevPosition, currPosition) && BoardTk.positionStatus(color, currPosition, board) === Consts.STATUS_NONE);
        if(BoardTk.checkIfOneSpaceMove(prevPosition, currPosition) && BoardTk.isOpposingStraightSliderPiece(color, currPosition, board)){
            numOfChecks++;
            attackers.add(currPosition)
        }
    });
    if(removeKing){
        if(color === Consts.WHITE){
            board[kingPosition] = Consts.WHITE_KING;
        }
        else{
            board[kingPosition] = Consts.BLACK_KING;
        }
    }
    return [numOfChecks, attackers];
}

const getPinnedPieces = (color, kingPosition, board) => {
    let pinnedPiecesPositions = new Set();

    for(let i = 0; i < 64; i++){
        if(BoardTk.isOpposingDiagonalSliderPiece(color, i, board)){
            for(let j = 0; j < 4; j++){
                let oppPieceMoves = getAllMovesInOneDirection(
                        BoardTk.getOpposingColor(color), i, Consts.DIAGONAL_SLIDERS[j], board)[0];
                let kingSlidingMoves = getAllMovesInOneDirection(
                        BoardTk.getOpposingColor(color), kingPosition, Consts.DIAGONAL_SLIDERS[3 - j], board)[0];

                kingSlidingMoves.forEach(move => {
                    if(oppPieceMoves.has(move)){
                        pinnedPiecesPositions.add(move);
                    }
                });
            }
        }
        if(BoardTk.isOpposingStraightSliderPiece(color, i, board)){
            for(let j = 0; j < 4; j++){
                let oppPieceMoves = getAllMovesInOneDirection(
                        BoardTk.getOpposingColor(color), i, Consts.STRAIGHT_SLIDERS[j], board)[0];
                let kingSlidingMoves = getAllMovesInOneDirection(
                        BoardTk.getOpposingColor(color), kingPosition, Consts.STRAIGHT_SLIDERS[3 - j], board)[0];

                kingSlidingMoves.forEach(move => {
                    if(oppPieceMoves.has(move)){
                        pinnedPiecesPositions.add(move);
                    }
                });
            }
        }
    }

    return pinnedPiecesPositions;
}

const getPinnedPiecesValidSquares = (color, pinnedPiecePosition, kingPosition, board) => {
    let boardCopy = board.slice();
    boardCopy[pinnedPiecePosition] = Consts.NONE;
    let validMoves = null;

    Consts.STRAIGHT_SLIDERS.forEach(move => {
        let slidingMoves = getAllMovesInOneDirection(color, kingPosition, move, boardCopy);
        if(slidingMoves[1] && BoardTk.isOpposingStraightSliderPiece(color, slidingMoves[2], boardCopy)){
            validMoves = slidingMoves[0];
        }
    });
    Consts.DIAGONAL_SLIDERS.forEach(move => {
        let slidingMoves = getAllMovesInOneDirection(color, kingPosition, move, boardCopy);
        if(slidingMoves[1] && BoardTk.isOpposingDiagonalSliderPiece(color, slidingMoves[2], boardCopy)){
            validMoves = slidingMoves[0];
        }
    });
    return validMoves;
}

const getSquaresBetweenKingAndAttacker = (color, kingPosition, board) => {
    let validMoves = null;

    Consts.STRAIGHT_SLIDERS.forEach(move => {
        let slidingMoves = getAllMovesInOneDirection(color, kingPosition, move, board);
        if(slidingMoves[1] && BoardTk.isOpposingStraightSliderPiece(color, slidingMoves[2], board)){
            validMoves = slidingMoves[0];
        }
    });
    Consts.DIAGONAL_SLIDERS.forEach(move => {
        let slidingMoves = getAllMovesInOneDirection(color, kingPosition, move, board);
        if(slidingMoves[1] && BoardTk.isOpposingDiagonalSliderPiece(color, slidingMoves[2], board)){
            validMoves = slidingMoves[0];
        }
    });
    return validMoves;
}

/**
 * 
 * @param {*} color 
 * @param {*} position 
 * @param {*} move 
 * @param {*} board 
 * 
 * Returns an array: 
 *     [valid tiles this piece can move to, whether it hits an enemy piece at the end (true/false), the piece that was hit]
 */
const getAllMovesInOneDirection = (color, position, move, board) => {
    let moves = new Set();
    position += move;
    let hitEnemy = false;
    let hitPiece = null;
    if(!BoardTk.checkIfOneSpaceMove(position - move, position)){
        return [moves, hitEnemy, hitPiece];
    }
    let status = null;
    while((status = BoardTk.positionStatus(color, position, board)) === Consts.STATUS_NONE){
        moves.add(position);

        position += move;
        if(!BoardTk.checkIfOneSpaceMove(position - move, position)){
            return [moves, hitEnemy, hitPiece];
        }
    }
    if(status === Consts.STATUS_DIFF_COLOR){
        moves.add(position);
        hitEnemy = true;
        hitPiece = position;
    }
    return [moves, hitEnemy, hitPiece];
}

const generatePawnMoves = (color, pawnPosition, board, validSquares, enPassantPos) => {
    let moves = new Set();
    
    // one move forward
    let forward = BoardTk.forwardValue(color);
    let nextPosition = pawnPosition + forward;
    let status = BoardTk.positionStatus(color, nextPosition, board);
    if(status === Consts.STATUS_NONE){
        addMoveIfValid(nextPosition, moves, validSquares);

        // two spaces forward
        if(BoardTk.pawnAtStartRow(color, pawnPosition)){
            nextPosition += forward;
            status = BoardTk.positionStatus(color, nextPosition, board);
            if(status === Consts.STATUS_NONE){
                addMoveIfValid(nextPosition, moves, validSquares);
            }
            nextPosition -= forward;
        }
    }

    // attacks 
    if(BoardTk.checkIfOneSpaceMove(nextPosition, nextPosition - 1)){
        nextPosition--;
        status = BoardTk.positionStatus(color, nextPosition, board);
        if(status === Consts.STATUS_DIFF_COLOR || nextPosition === enPassantPos){
            addMoveIfValid(nextPosition, moves, validSquares);
        }
        nextPosition++;
    }
    if(BoardTk.checkIfOneSpaceMove(nextPosition, nextPosition + 1)){
        nextPosition = nextPosition + 1;
        status = BoardTk.positionStatus(color, nextPosition, board);
        if(status === Consts.STATUS_DIFF_COLOR || nextPosition === enPassantPos){
            addMoveIfValid(nextPosition, moves, validSquares);
        }
    }

    return moves;
}

const generateKnightMoves = (color, knightPosition, board, validSquares) => {
    let moves = new Set();
    Consts.KNIGHT_MOVES.forEach(move => {
        let newPosition = knightPosition + move;

        if(BoardTk.checkIfOneSpaceMove(knightPosition, newPosition)){
            let status = BoardTk.positionStatus(color, newPosition, board);
            if(status === Consts.STATUS_DIFF_COLOR || status === Consts.STATUS_NONE){
                addMoveIfValid(newPosition, moves, validSquares);
            }
        }
    });
    return moves;
}

const generateBishopMoves = (color, bishopPosition, board, validSquares) => {
    let moves = new Set();

    Consts.DIAGONAL_SLIDERS.forEach(move => {
        let newPosition = bishopPosition + move;
        let status = BoardTk.positionStatus(color, newPosition, board);
        while(status === Consts.STATUS_NONE){
            if(!BoardTk.checkIfOneSpaceMove(newPosition - move, newPosition)){
                break;
            }
            addMoveIfValid(newPosition, moves, validSquares);
            newPosition += move;
            status = BoardTk.positionStatus(color, newPosition, board);
        }
        
        if(BoardTk.checkIfOneSpaceMove(newPosition - move, newPosition)){
            if(status === Consts.STATUS_DIFF_COLOR){
                addMoveIfValid(newPosition, moves, validSquares);
            }
        }
    });

    return moves;
}

const generateRookMoves = (color, rookPosition, board, validSquares) => {
    let moves = new Set();

    Consts.STRAIGHT_SLIDERS.forEach(move => {
        let newPosition = rookPosition + move;
        let status = BoardTk.positionStatus(color, newPosition, board);
        while(status === Consts.STATUS_NONE){
            if(!BoardTk.checkIfOneSpaceMove(newPosition - move, newPosition)){
                break;
            }
            addMoveIfValid(newPosition, moves, validSquares);
            newPosition += move;
            status = BoardTk.positionStatus(color, newPosition, board);
        }
        
        if(BoardTk.checkIfOneSpaceMove(newPosition - move, newPosition)){
            if(status === Consts.STATUS_DIFF_COLOR){
                addMoveIfValid(newPosition, moves, validSquares);
            }
        }
    });
    return moves;
}

const generateQueenMoves = (color, queenPosition, board, validSquares) => {
    let movesBishop = generateBishopMoves(color, queenPosition, board, validSquares);
    let movesRook = generateRookMoves(color, queenPosition, board, validSquares);
    let moves = new Set(movesBishop);
    movesRook.forEach(move => moves.add(move));
    return moves;
}

const generateKingMoves = (color, kingPosition, board, validSquares, castlingCodes) => {
    let moves = new Set();
    Consts.KING_MOVES.forEach(move => {
        let newPosition = kingPosition + move;

        if(BoardTk.checkIfOneSpaceMove(kingPosition, newPosition)){
            let status = BoardTk.positionStatus(color, newPosition, board);
            if(status === Consts.STATUS_DIFF_COLOR || status === Consts.STATUS_NONE){
                if(getNumberOfTimesAttacked(color, newPosition, board, true, kingPosition)[0] === 0){
                    moves.add(newPosition);
                }
            }
        }
    });

    let kingsideMovement = -1;
    let kingsideCodeIndex = color === Consts.WHITE ? 0 : 2; 

    //kingside castling
    if(
        castlingCodes[kingsideCodeIndex] &&
        BoardTk.positionStatus(color, kingPosition + kingsideMovement, board) === Consts.STATUS_NONE &&
        BoardTk.positionStatus(color, kingPosition + (kingsideMovement * 2), board) === Consts.STATUS_NONE &&
        getNumberOfTimesAttacked(color, kingPosition, board)[0] === 0 &&
        getNumberOfTimesAttacked(color, kingPosition + kingsideMovement, board)[0] === 0 &&
        getNumberOfTimesAttacked(color, kingPosition + (kingsideMovement * 2), board)[0] === 0
        ){
            let newPosition = kingPosition + (kingsideMovement * 2);
            if(getNumberOfTimesAttacked(color, newPosition, board)[0] === 0){
                moves.add(newPosition);
            }
        }
    
    let queensideMovement = 1;
    let queensideCodeIndex = color === Consts.WHITE ? 1 : 3; 
    //queenside castling
    if(
        castlingCodes[queensideCodeIndex] &&
        BoardTk.positionStatus(color, kingPosition + queensideMovement, board) === Consts.STATUS_NONE &&
        BoardTk.positionStatus(color, kingPosition + (queensideMovement * 2), board) === Consts.STATUS_NONE &&
        BoardTk.positionStatus(color, kingPosition + (queensideMovement * 3), board) === Consts.STATUS_NONE &&
        getNumberOfTimesAttacked(color, kingPosition, board)[0] === 0 &&
        getNumberOfTimesAttacked(color, kingPosition + queensideMovement, board)[0] === 0 &&
        getNumberOfTimesAttacked(color, kingPosition + (queensideMovement * 2), board)[0] === 0 && 
        getNumberOfTimesAttacked(color, kingPosition + (queensideMovement * 3), board)[0] === 0
        ){
            let newPosition = kingPosition + (queensideMovement * 2);
            if(getNumberOfTimesAttacked(color, newPosition, board)[0] === 0){
                moves.add(newPosition);
            }
        }

    return moves;
}

const addMoveIfValid = (move, moves, validSquares) => {
    if(validSquares === null || validSquares === undefined){
        moves.add(move);
    }
    else{
        if(validSquares.has(move)){
            moves.add(move);
        }
    }
}