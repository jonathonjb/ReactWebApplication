let Consts = require('./ServerConstants');
let BoardTk = require('./ServerBoardToolKit');
let MoveGenerator = require('./ServerMoveGenerator');
const { evaluate } = require('./evaluation');
const { generateMoves } = require('./ServerMoveGenerator');

const DEPTH_LIMIT = 4; // number of half-turns checked; total turns checked is DEPTH_LIMIT + 1 / 2
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
    return executeMoveOnNewBoard(color, board, castleCodes, enPassantPos, result[1][0], result[1][1]);
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
    let newEnPassantPos = enPassantPos;

    newBoard[endPosition] = newBoard[startPosition];
    newBoard[startPosition] = Consts.NONE;
    return [newBoard, newCastleCodes, newEnPassantPos];
}

module.exports = {
    makeMove: makeMove
}