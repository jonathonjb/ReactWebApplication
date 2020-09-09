let Consts = require('./ServerConstants');
let BoardTk = require('./ServerBoardToolKit');
let MoveGenerator = require('./ServerMoveGenerator');
const { evaluate } = require('./evaluation');
const { generateMoves } = require('./ServerMoveGenerator');

const DEPTH_LIMIT = 4; // number of half-turns checked; total turns checked is (DEPTH_LIMIT + 1) / 2
let nodes = 0;

const makeDumbMove = (color, board, castleCodes, enPassantPos) => {
    let moves = MoveGenerator.generateMoves(color, board, castleCodes, enPassantPos);
    let iterator = moves.entries();

    let results = iterator.next();

    let allMoves = [];
    while(!results.done){
        let start = results.value[0];

        let values = results.value[1]
        let secondIterator = values.entries();

        let secondResults = secondIterator.next();
        while(!secondResults.done){
            let end = secondResults.value[0];
            allMoves.push([start, end]);
            secondResults = secondIterator.next();
        }

        results = iterator.next();
    }

    let min = 0;
    let max = allMoves.length;

    let rand = Math.floor(Math.random() * (max - min - 1) + min);
    let move = allMoves[rand];

    board[move[1]] = board[move[0]];
    board[move[0]] = Consts.NONE;
}

const makeMove = (color, board, castleCodes, enPassantPos) => {
    console.time('minimax');
    let result = minimax(color, board, castleCodes, enPassantPos, 0);
    console.timeEnd('minimax');
    console.log('total number of nodes: ' + nodes);
    nodes = 0;
    if(result[1] === null){
        return 'checkmated';
    }
    return [result[1][0], result[1][1], executeMoveOnNewBoard(color, board, castleCodes, enPassantPos, result[1][0], result[1][1])];
}

const minimax = (aiColor, board, castleCodes, enPassantPos, depth, alpha=Number.NEGATIVE_INFINITY, beta=Number.POSITIVE_INFINITY) => {
    if(depth > DEPTH_LIMIT){
        nodes++;
        return [evaluate(aiColor, board), null];
    }
    let maximizingPlayer = depth % 2 === 0;
    let oppColor = aiColor === Consts.WHITE ? Consts.BLACK : Consts.WHITE;
    let currColor = maximizingPlayer ? aiColor : oppColor;

    let bestMove = null;
    let bestScoringChild = maximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

    let moves = generateMoves(currColor, board, castleCodes, enPassantPos);


    for (let [start, endPositions] of moves){
        for(let end of endPositions){
            let child = executeMoveOnNewBoard(currColor, board, castleCodes, enPassantPos, start, end);
            let childBoard = child[0];
            let childCastleCodes = child[1];
            let childEnPassantPos = child[2];

            let childScore = minimax(aiColor, childBoard, childCastleCodes, childEnPassantPos, depth + 1, alpha, beta)[0];

            if(maximizingPlayer){
                if(childScore > bestScoringChild){
                    bestScoringChild = childScore;
                    bestMove = [start, end];
                }
                alpha = Math.max(childScore, bestScoringChild);
                if(alpha >= beta){
                    return [bestScoringChild, bestMove];
                }
            }
            else{
                if(childScore < bestScoringChild){
                    bestScoringChild = childScore;
                    bestMove = [start, end];
                }
                beta = Math.min(childScore, bestScoringChild);
                if(beta <= alpha){
                    return[bestScoringChild, bestMove];
                }
            }
        }
    }
    return [bestScoringChild, bestMove];
}

const executeMoveOnNewBoard = (color, board, castleCodes, enPassantPos, startPosition, endPosition) => {
    let newBoard = board.slice();
    let newCastleCodes = castleCodes.slice(); 
    let newEnPassantPos = -1;

    // handles en passant moves
    if(BoardTk.isTeamsPawn(color, startPosition, board)){
        let forward = BoardTk.forwardValue(color);
        if(endPosition === enPassantPos){
            newBoard[endPosition - forward] = Consts.NONE;
        }
        if(startPosition + (2 * forward) === endPosition){
            newEnPassantPos = startPosition + forward;
        }
    }

    // handles castling moves
    if(BoardTk.isTeamsKing(color, startPosition, board) && Math.abs(startPosition - endPosition) === 2){
        // white kingside castle 
        if (endPosition === 1) {
            newBoard[0] = Consts.NONE;
            newBoard[2] = Consts.WHITE_ROOK;
        }
        // white queenside castle
        else if (endPosition === 5) {
            newBoard[7] = Consts.NONE;
            newBoard[4] = Consts.WHITE_ROOK;
        }
        // black kingside castle
        else if (endPosition === 57) {
            newBoard[56] = Consts.NONE;
            newBoard[58] = Consts.BLACK_ROOK;
        }
        else if (endPosition === 61) {
            newBoard[63] = Consts.NONE;
            newBoard[60] = Consts.BLACK_ROOK;
        }
    }

    // modifies castling codes
    if (BoardTk.isTeamsRook(color, startPosition, board)) {
            // modify castlingCodes if user moved peviously unmoved rook
            // white kingside rook
            if (newCastleCodes[0] === true && startPosition === 0) {
                newCastleCodes[0] = false;
            }
            // white queenside rook
            else if (newCastleCodes[1] === true && startPosition === 7) {
                newCastleCodes[1] = false;
            }
            // black kingside rook
            else if (newCastleCodes[2] === true && startPosition === 56) {
                newCastleCodes[2] = false;
            }
            // black queenside rook
            else if (newCastleCodes[3] === true && startPosition === 63) {
                newCastleCodes[3] = false;
            }
        }
        else if (BoardTk.isTeamsKing(color, startPosition, board)) {
            if (color === Consts.WHITE) {
                newCastleCodes[0] = false;
                newCastleCodes[1] = false;
            }
            else if (color === Consts.BLACK) {
                newCastleCodes[2] = false;
                newCastleCodes[3] = false;
            }
        }
    

    newBoard[endPosition] = newBoard[startPosition];
    newBoard[startPosition] = Consts.NONE;
    return [newBoard, newCastleCodes, newEnPassantPos];
}

module.exports = {
    makeMove: makeMove
}