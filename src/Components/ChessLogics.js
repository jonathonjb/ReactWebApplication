export const EMPTY = 0;
export const PAWN = 1;
export const KNIGHT = 2;
export const BISHOP = 3;
export const ROOK = 4;
export const QUEEN = 5;
export const KING = 6;

export const KINGSIDE_CASTLE = 10;
export const QUEENSIDE_CASTLE = 11;

// isWhite ALWAYS refers to the user's color. Never the color of the AI / opponent.

export const startPosition = [
    [-ROOK, -KNIGHT, -BISHOP, -QUEEN, -KING, -BISHOP ,-KNIGHT, -ROOK],
    [-PAWN, -PAWN, -PAWN, -PAWN, -PAWN, -PAWN, -PAWN, -PAWN],
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], 
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], 
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], 
    [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], 
    [PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN],
    [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP ,KNIGHT, ROOK]
]

export const getEligiblePositions = (row, col, board, castlingCodes, enPassantPos) => {
    let piece = board[row][col];
    let eligiblePositions = [];
    switch(Math.abs(piece)){
        case PAWN:
            eligiblePositions = getPawnEligiblePositions(row, col, board, enPassantPos);
            break;
        case KNIGHT:
            eligiblePositions = getKnightEligiblePositions(row, col, board);
            break;
        case BISHOP:
            eligiblePositions = getBishopEligiblePositions(row, col, board);
            break;
        case ROOK:
            eligiblePositions = getRookEligiblePositions(row, col, board);
            break;
        case QUEEN:
            eligiblePositions = getQueenEligiblePositions(row, col, board);
            break;
        case KING:
            eligiblePositions = getKingEligiblePositions(row, col, board, castlingCodes);
            break;
        default:
            break;
    }
    return eligiblePositions;
}

const getPawnEligiblePositions = (row, col, board, enPassantPos) => {
    let piece = board[row][col];
    // checks if piece is actually a pawn

    let eligiblePositions = [];
    let isWhite = piece > 0;
    let forward = isWhite ? -1 : 1;

    let nextRow = row + forward;
    if(inBound(nextRow, col) && !positionContainsPiece(nextRow, col, board)){
        eligiblePositions.push([nextRow, col]);
    }

    for(let nextCol = col - 1; nextCol <= col + 1; nextCol += 2){
        if(inBound(nextRow, nextCol) && positionContainsEnemyPiece(nextRow, nextCol, isWhite, board)){
            eligiblePositions.push([nextRow, nextCol]);
        }
        else if(enPassantPos[0] === row && enPassantPos[1] === nextCol && positionContainsEnemyPiece(row, nextCol, isWhite, board)){
            eligiblePositions.push([nextRow, nextCol]);
        }
    }

    nextRow = row + (forward * 2);
    if((isWhite ? row === 6 : row === 1) && !positionContainsPiece(row + forward, col, board) && !positionContainsPiece(nextRow, col, board)){
        eligiblePositions.push([nextRow, col]);
    }

    return eligiblePositions;
}

const getKnightEligiblePositions = (row, col, board) => {
    let piece = board[row][col];
    // checks if piece is actually a knight

    let eligiblePositions = [];
    let isWhite = piece > 0;

    let moves = [[-1, -2], [-2, -1], [-2, 1], [1, -2], [-1, 2], [2, -1], [1, 2], [2, 1]];
    moves.forEach(move => {
        let newRow = row + move[0];
        let newCol = col + move[1];
        if(inBound(newRow, newCol) && !positionContainsUserPiece(newRow, newCol, isWhite, board)){
            eligiblePositions.push([newRow, newCol]);
        }
    });
    return eligiblePositions;
}

const getBishopEligiblePositions = (row, col, board) => {
    let piece = board[row][col];
    // checks if piece is actually a bishop

    let eligiblePositions = [];
    let isWhite = piece > 0;

    let forwards = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    forwards.forEach(move => {
        let newRow = row;
        let newCol = col;
        while(true){
            newRow += move[0];
            newCol += move[1];
            if(!inBound(newRow, newCol)){
                break;
            }
            if(!positionContainsPiece(newRow, newCol, board)){
                eligiblePositions.push([newRow, newCol]);
            }
            else if(positionContainsEnemyPiece(newRow, newCol, isWhite, board)){
                eligiblePositions.push([newRow, newCol]);
                break;
            }
            else{
                break;
            }
        }
    });
    return eligiblePositions;
}

const getRookEligiblePositions = (row, col, board) => {
    let piece = board[row][col];
    // checks if piece is actually a rook

    let eligiblePositions = [];
    let isWhite = piece > 0;

    let forwards = [[-1, 0], [0, -1], [1, 0], [0, 1]];
    forwards.forEach(move => {
        let newRow = row;
        let newCol = col;
        while(true){
            newRow += move[0];
            newCol += move[1];
            if(!inBound(newRow, newCol)){
                break;
            }
            if(!positionContainsPiece(newRow, newCol, board)){
                eligiblePositions.push([newRow, newCol]);
            }
            else if(positionContainsEnemyPiece(newRow, newCol, isWhite, board)){
                eligiblePositions.push([newRow, newCol]);
                break;
            }
            else{
                break;
            }
        }
    });
    return eligiblePositions;
}

const getQueenEligiblePositions = (row, col, board) => {
    let piece = board[row][col];
    // checks if piece is actually a queen

    return getBishopEligiblePositions(row, col, board).concat(getRookEligiblePositions(row, col, board));
}

const getKingEligiblePositions = (row, col, board, castlingCodes) => {
    let piece = board[row][col];
    // checks if piece is actually a bishop

    let eligiblePositions = [];
    let isWhite = piece > 0;

    let moves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1]];
    moves.forEach(move => {
        let newRow = row + move[0];
        let newCol = col + move[1];
        if(inBound(newRow, newCol) && !positionContainsUserPiece(newRow, newCol, isWhite, board)){
            eligiblePositions.push([newRow, newCol]);
        }
    });


    // checks if king can castle at the kingside
    // white
    if(isWhite && castlingCodes[0] && !positionContainsPiece(7, 5, board) && !positionContainsPiece(7, 6, board)){
        eligiblePositions.push(KINGSIDE_CASTLE);
    }
    // black
    else if(!isWhite && castlingCodes[2] && !positionContainsPiece(0, 5, board) && !positionContainsPiece(0, 6, board)){
        eligiblePositions.push(KINGSIDE_CASTLE);
    }

    // checks if king can castle at the queenside
    // white
    if(isWhite && castlingCodes[1] && !positionContainsPiece(7, 1, board) && !positionContainsPiece(7, 2, board) &&
                !positionContainsPiece(7, 3, board)){
        eligiblePositions.push(QUEENSIDE_CASTLE);
    }
    // black
    else if(!isWhite && castlingCodes[3] && !positionContainsPiece(0, 1, board) && !positionContainsPiece(0, 2, board) &&
                !positionContainsPiece(0, 3, board)){
        eligiblePositions.push(QUEENSIDE_CASTLE);
    }

    return eligiblePositions;
}

const inBound = (row, col) => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export const positionContainsPiece = (row, col, board) => {
    return board[row][col] !== EMPTY;
}

const positionContainsEnemyPiece = (row, col, userIsWhite, board) => {
    return userIsWhite ? board[row][col] < 0 : board[row][col] > 0;
}

export const positionContainsUserPiece = (row, col, userIsWhite, board) => {
    return userIsWhite ? board[row][col] > 0 : board[row][col] < 0;
}

export const getIfPinned = (row, col, isWhite, numOfchecks, board) => {
    let tempBoard = board.map(row => row.slice());
    tempBoard[row][col] = EMPTY;
    return getNumOfChecks(isWhite, tempBoard) > numOfchecks;
}

export const getNumOfChecks = (isWhite, board) => {
    let kingPos = getKingPosition(isWhite, board);
    let numOfChecks = 0;

    // check if there are any knight checks
    let moves = [[-1, -2], [-2, -1], [-2, 1], [1, -2], [-1, 2], [2, -1], [1, 2], [2, 1]];
    moves.forEach(move => {
        let newRow = kingPos[0] + move[0];
        let newCol = kingPos[1] + move[1];
        if(inBound(newRow, newCol) && (isWhite ? board[newRow][newCol] === -KNIGHT : board[newRow][newCol] === KNIGHT)){
            numOfChecks++;
        }
    });

    // check if there are any bishops or queen in the diagonals
    let forwards = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    forwards.forEach(move => {
        let newRow = kingPos[0];
        let newCol = kingPos[1];
        while(true){
            newRow += move[0];
            newCol += move[1];
            if(!inBound(newRow, newCol) || positionContainsUserPiece(newRow, newCol, isWhite, board)){
                break;
            }
            else if(Math.abs(board[newRow][newCol]) === BISHOP || Math.abs(board[newRow][newCol]) === QUEEN){
                numOfChecks++;
            }
        }
    });

    // check if there are any bishops or queen in the straight lines
    forwards = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    forwards.forEach(move => {
        let newRow = kingPos[0];
        let newCol = kingPos[1];
        while(true){
            newRow += move[0];
            newCol += move[1];
            if(!inBound(newRow, newCol) || positionContainsUserPiece(newRow, newCol, isWhite, board)){
                break;
            }
            else if(Math.abs(board[newRow][newCol]) === ROOK || Math.abs(board[newRow][newCol]) === QUEEN){
                numOfChecks++;
            }
        }
    });

    return numOfChecks;
}

export const getKingPosition = (isWhite, board) => {
    for(let row = 0; row < 8; row++){
        for(let col = 0; col < 8; col++){
            let piece = board[row][col];
            if(Math.abs(piece) === KING && (isWhite ? piece > 0 : piece < 0)){
                return [row, col];
            }
        }
    }
    console.error("King not found on the board");
}