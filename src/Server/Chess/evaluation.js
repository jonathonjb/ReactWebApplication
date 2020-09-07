const BoardTk = require('./ServerBoardToolKit');
const Consts = require('./ServerConstants');
const { generateMoves } = require('./ServerMoveGenerator');

const evaluate = (aiColor, board) => {
    let oppPawns = 0;
    let oppKnights = 0;
    let oppBishops = 0;
    let oppRooks = 0;
    let oppQueens = 0;
    let oppKings = 0;

    let aiPawns = 0;
    let aiKnights = 0;
    let aiBishops = 0;
    let aiRooks = 0;
    let aiQueens = 0;
    let aiKings = 0;

    for(let i = 0; i < 64; i++){
        let status = BoardTk.positionStatus(aiColor, i, board);
        if(status === Consts.STATUS_DIFF_COLOR){
            if(BoardTk.isOpposingPawn(aiColor, i, board)){
                oppPawns++;
            }
            else if(BoardTk.isOpposingBishop(aiColor, i, board)){
                oppKnights++;
            }
            else if(BoardTk.isOpposingKnight(aiColor, i, board)){
                oppBishops++;
            }
            else if(BoardTk.isOpposingRook(aiColor, i, board)){
                oppRooks++;
            }
            else if(BoardTk.isOpposingQueen(aiColor, i, board)){
                oppQueens++;
            }
            else if(BoardTk.isOpposingKing(aiColor, i, board)){
                oppKings++;
            }
        }
        else if(status === Consts.STATUS_SAME_COLOR){
            if(BoardTk.isTeamsPawn(aiColor, i, board)){
                aiPawns++;
            }
            else if(BoardTk.isTeamsBishop(aiColor, i, board)){
                aiBishops++;
            }
            else if(BoardTk.isTeamsKnight(aiColor, i, board)){
                aiKnights++;
            }
            else if(BoardTk.isTeamsRook(aiColor, i, board)){
                aiRooks++;
            }
            else if(BoardTk.isTeamsQueen(aiColor, i, board)){
                aiQueens++;
            }
            else if(BoardTk.isTeamsKing(aiColor, i, board)){
                aiKings++;
            }
        }
    }
    let numPiecesScore = 200 * (aiKings - oppKings) +
                        9 * (aiQueens - oppQueens) +
                        5 * (aiRooks - oppRooks) +
                        3 * (aiKnights - oppKnights) +
                        3 * (aiBishops - oppBishops) +
                        1 * (aiPawns - oppPawns);
    
    let pawnStructureScore = evaluatePawnStructure(aiColor, board);
    let mobilityScore = evaluateMobility(aiColor, board);
    return numPiecesScore + pawnStructureScore + mobilityScore;
}

const evaluatePawnStructure = (aiColor, board) => {
    let netDoubledPawns = getNetDoubledPawns(aiColor, board);
    let netBlockedPawns = getNetBlockedPawns(aiColor, board);
    let netIsolatedPawns = getNetIsolatedPawns(aiColor, board);
    return -0.5 * (netDoubledPawns + netBlockedPawns + netIsolatedPawns);
}

const evaluateMobility = (aiColor, board) => {
    let aiMoves = generateMoves(aiColor, board, board, [false, false, false, false], -1);
    let oppMoves = generateMoves(BoardTk.getOpposingColor(aiColor, board), board, [false, false, false, false], -1);

    let aiMobilityScore = 0;
    let oppMobilityScore = 0;

    aiMoves.forEach((value, key) => {
        aiMobilityScore += value.size;
    })
    oppMoves.forEach((value, key) => {
        oppMobilityScore += value.size;
    });

    return 0.1 * (aiMobilityScore - oppMobilityScore);
}

const getNetDoubledPawns = (aiColor, board) => {
    let oppDoubledPawns = 0;
    let aiDoubledPawns = 0;

    let oppPawnFlag = false;
    let aiPawnFlag = false;
    for(let col = 0; col < 8; col++){
        let i = col;
        for(let row = 0; row < 8; row++){
            if(BoardTk.isOpposingPawn(aiColor, i, board)){
                if(oppPawnFlag){
                    oppDoubledPawns++;
                }
                else{
                    oppPawnFlag = true;
                }
            }
            else if(BoardTk.isTeamsPawn(aiColor, i, board)){
                if(aiPawnFlag){
                    aiDoubledPawns++;
                }
                else{
                    aiPawnFlag = true;
                }
            }
            i += 8;
        }
        oppPawnFlag = false;
        aiPawnFlag = false;
    }

    return aiDoubledPawns - oppDoubledPawns;
}

const getNetBlockedPawns = (aiColor, board) => {
    let oppBlockedPawns = 0;
    let aiBlockedPawns = 0;
    let aiForward = BoardTk.forwardValue(aiColor);

    for(let col = 0; col < 8; col++){
        let i = col;
        for(let row = 0; row < 8; row++){
            if(BoardTk.isOpposingPawn(aiColor, i, board)){
                if(BoardTk.positionStatus(aiColor, i + (aiForward * -1), board) === Consts.STATUS_SAME_COLOR){
                    oppBlockedPawns++;
                }
            }
            else if(BoardTk.isTeamsPawn(aiColor, i, board)){
                if(BoardTk.positionStatus(aiForward, i + aiForward, board) === Consts.STATUS_DIFF_COLOR){
                    aiBlockedPawns++;
                }
            }
            i += 8;
        }
    }

    return aiBlockedPawns - oppBlockedPawns;
}

getNetIsolatedPawns = (aiColor, board) => {
    let oppPawnFlags = [false, false, false, false, false, false, false, false];
    let aiPawnFlags = [false, false, false, false, false, false, false, false];

    for(let col = 0; col < 8; col++){
        let i = col;
        for(let row = 0; row < 8; row++){
            if(BoardTk.isOpposingPawn(aiColor, i, board)){
                oppPawnFlags[col] = true;
            }
            else if(BoardTk.isTeamsPawn(aiColor, i, board)){
                aiPawnFlags[col] = true;
            }
            i += 8;
        }
    }

    let oppIsolatedPawns = 0;
    let aiIsolatedPawns = 0;

    if(oppPawnFlags[0] && !oppPawnFlags[1]){
        oppIsolatedPawns++;
    }
    if(aiPawnFlags[0] && !aiPawnFlags[1]){
        aiIsolatedPawns++;
    }

    for(let i = 1; i < 7; i++){
        if(oppPawnFlags[i] && !oppPawnFlags[i - 1] && !oppPawnFlags[i + 1]){
            oppIsolatedPawns++;
        }
        if(aiPawnFlags[i] && !aiPawnFlags[i - 1] && !aiPawnFlags[i + 1]){
            aiIsolatedPawns++;
        }
    }

    if(oppPawnFlags[7] && !oppPawnFlags[6]){
        oppIsolatedPawns++;
    }
    if(aiPawnFlags[7] && !aiPawnFlags[6]){
        aiIsolatedPawns++;
    }

    return aiIsolatedPawns - oppIsolatedPawns;
}

module.exports = {
    evaluate
}