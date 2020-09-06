import * as BoardTk from './BoardToolKit';
import * as Consts from './Constants';

export const generateMoves = (color, board) => {
    let kingPosition = BoardTk.getKingPosition(color, board);
    let numOfChecks = getNumberOfChecks(color, kingPosition, board);

    if(numOfChecks === 0){

    }
    else if(numOfChecks === 1){

    }
    else{
        
    }
}

const getNumberOfChecks = (color, kingPosition, board) => {
    let numOfChecks = 0;
    Consts.KNIGHT_MOVES.forEach(move => {
        let position = kingPosition + move;
        if(BoardTk.isOpposingKnight(position, color, board)){
            numOfChecks++;
        }
    });

    Consts.DIAGONAL_SLIDERS.forEach(slider => {
        let position = kingPosition;
        do{
            position += slider;
        }
        while(BoardTk.positionStatus(position, color, board) === Consts.STATUS_NONE)

        if(BoardTk.isOpposingDiagonalSliderPiece(position, color, board)){
            numOfChecks++;
        }
    });

    console.log('\n');

    Consts.STRAIGHT_SLIDERS.forEach(slider => {
        let position = kingPosition;
        do{
            position += slider;
        }
        while(BoardTk.positionStatus(position, color, board) === Consts.STATUS_NONE);

        if(BoardTk.isOpposingStraightSliderPiece(position, color, board)){
            numOfChecks++;
        }
    });

    return numOfChecks;
}