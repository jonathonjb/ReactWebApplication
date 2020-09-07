let Consts = require('./ServerConstants');
let BoardTk = require('./ServerBoardToolKit');
let MoveGenerator = require('./ServerMoveGenerator');

const makeMove = (color, board, castleCodes, enPassantPos) => {
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

    let rand = getRandomIntFromInterval(min, max);
    let move = allMoves[rand];

    board[move[1]] = board[move[0]];
    board[move[0]] = Consts.NONE;
}

const getRandomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min - 1) + min);
}

module.exports = {
    makeMove: makeMove
}