let Consts = require('./ServerConstants');
let BoardTk = require('./ServerBoardToolKit');
let MoveGenerator = require('./ServerMoveGenerator');
const { evaluate } = require('./evaluation');
const { generateMoves } = require('./ServerMoveGenerator');

const DEPTH_LIMIT = 1; // number of half-turns checked; total turns checked is DEPTH_LIMIT / 2

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
    let result = minimax(color, board, castleCodes, enPassantPos, 0);
    return executeMoveOnNewBoard(color, board, castleCodes, enPassantPos, result[1][0], result[1][1]);
}

const minimax = (aiColor, board, castleCodes, enPassantPos, depth) => {
    if(depth > DEPTH_LIMIT){
        return [evaluate(aiColor, board), null];
    }
    let maximizingPlayer = depth % 2 === 0;
    let oppColor = aiColor === Consts.WHITE ? Consts.BLACK : Consts.WHITE;
    let currColor = maximizingPlayer ? aiColor : oppColor;

    let bestMove = null;
    let bestScoringChild = maximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

    let moves = generateMoves(currColor, board, castleCodes, enPassantPos);

    moves.forEach((endPositions, start) => {
        endPositions.forEach(end => {
            let child = executeMoveOnNewBoard(currColor, board, castleCodes, enPassantPos, start, end);
            let childBoard = child[0];
            let childCastleCodes = child[1];
            let childEnPassantPos = child[2];

            let childScore = minimax(aiColor, childBoard, childCastleCodes, childEnPassantPos, depth + 1)[0];

            if(maximizingPlayer){
                if(childScore > bestScoringChild){
                    bestScoringChild = childScore;
                    bestMove = [start, end];
                }
            }
            else{
                if(childScore < bestScoringChild){
                    bestScoringChild = childScore;
                    bestMove = [start, end];
                }
            }
        });
    });
    return [bestScoringChild, bestMove];
}

const executeMoveOnNewBoard = (color, board, castleCodes, enPassantPos, startPosition, endPosition) => {
    let newBoard = board.slice();
    let newCastleCodes = castleCodes.slice(); 
    let newEnPassantPos = enPassantPos;

    newBoard[endPosition] = newBoard[startPosition];
    newBoard[startPosition] = Consts.NONE;
    return [newBoard, newCastleCodes, newEnPassantPos];
}

module.exports = {
    makeMove: makeMove
}