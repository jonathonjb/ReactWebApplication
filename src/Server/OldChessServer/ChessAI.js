const Logics = require('./AIChessLogics');

const getMove = (isWhite, board, castlingCode, advancedPawnPos) => {
    for(let row = 0; row < 8; row++){
        for(let col = 0; col < 8; col++){
            let piece = board[row][col]
            if((isWhite ? piece > 0 : piece < 0)){
                let eligiblePositions = Logics.getEligiblePositions(row, col, board, castlingCode, advancedPawnPos);
                if(eligiblePositions.length > 0){
                    board[eligiblePositions[0][0]][eligiblePositions[0][1]] = piece;
                    board[row][col] = Logics.EMPTY;
                    return;
                }
            }
        }
    }
    return;
}

const miniMax = (isWhite, board, castlingCode, advancedPawnPos) => {
    
}

module.exports = {
    getMove: getMove
}