import React from 'react'
import '../Stylesheets/Chess.css'

import blackPawn from '../Images/Chess/blackPawn.png'
import whitePawn from '../Images/Chess/whitePawn.png'
import blackKnight from '../Images/Chess/blackKnight.png'
import whiteKnight from '../Images/Chess/whiteKnight.png'
import blackBishop from '../Images/Chess/blackBishop.png'
import whiteBishop from '../Images/Chess/whiteBishop.png'
import blackRook from '../Images/Chess/blackRook.png'
import whiteRook from '../Images/Chess/whiteRook.png'
import blackQueen from '../Images/Chess/blackQueen.png'
import whiteQueen from '../Images/Chess/whiteQueen.png'
import blackKing from '../Images/Chess/blackKing.png'
import whiteKing from '../Images/Chess/whiteKing.png'

import * as Logics from './ChessLogics'
import $, { timers } from 'jquery'

/**
 * board[row][col] 
 * The board will start from the top. 
 * board[0][0] references to the position at the top left of the board, 
 * board[0][7] references to the position at the top right, and
 * board[7][7] references to the position at the bottom right.
 * 
 * The 'active' position state is the position on the board that is about to be moved. It has to be a position that contains
 * a user piece. When the 'active' state is [-1, -1], then the next position the user clicks (which contains a user piece) 
 * will become the 'active' position. From there, we will calculate all of the 'elgible positions'. 
 * 
 * The 'elgible positions' are the positions the piece at the 'active position' can move to.
 * 
 * If the user clicks on a position while the active position is not [-1, -1], then we will check if the clicked position
 * is in the 'elgible positions' array in the states property. If it is, then the piece will be moved to the clicked position,
 * the 'active position' will revert back to [-1, -1] and the 'elgible positions' will be empty.
 * 
 * 
 * 
 * The board will contain these pieces. White pieces will always be positive, while black pieces will be negative. 
 * Ex: Logics.PAWN = white pawn, -Logics.QUEEN = black queen, -Logics.BISHOP = black bishop, Logics.KING = white king, etc...
 * 
 * Logics.EMPTY (0) means there is no pieces at this area.
 */

const xhr = new XMLHttpRequest();

export default class Chess extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            usersTurn: false,
            board: Logics.startPosition,
            isWhite: true,
            activePosition: [-1, -1],
            eligiblePositions: [],

            // the castling codes represents whether the king can castle. It represents castling at:
            // [white kingside, white queenside, black kingside, black queenside]
            castlingCode: [true, true, true, true], 

            // The position where a pawn just moved two spaces - the en passant move can be made to remove a pawn at this position.
            advancedPawnPos: [-1, -1],

            pawnPromotionPos: [-1, -1]
        }

        this.renderPiece = this.renderPiece.bind(this);
        this.handleTileClick = this.handleTileClick.bind(this);
        this.switchTeams = this.switchTeams.bind(this);
        this.getInfo = this.getInfo.bind(this);
        this.startTurn = this.startTurn.bind(this);
        this.endTurn = this.endTurn.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.sendCurrentStateToServer = this.sendCurrentStateToServer.bind(this);
        this.choosePiece = this.choosePiece.bind(this);
    }

    handleTileClick(row, col){
        if(this.state.usersTurn){
            if(Logics.positionContainsUserPiece(row, col, this.state.isWhite, this.state.board)){
                this.setState({
                    activePosition: [row, col],
                    eligiblePositions: Logics.getEligiblePositions(row, col, this.state.board, this.state.castlingCode, this.state.advancedPawnPos)
                });
            }
            else{
                let moveMade = false;
                for(let i = 0; i < this.state.eligiblePositions.length; i++){
                    if(this.state.eligiblePositions[i] === Logics.KINGSIDE_CASTLE){
                        // white
                        if(this.kingsideCastle(col)){
                            moveMade = true
                            break;
                        }
                    }
                    else if(this.state.eligiblePositions[i] === Logics.QUEENSIDE_CASTLE){
                        // white
                        if(this.queensideCastle(col)){
                            moveMade = true;
                            break;
                        }
                    }

                    else{
                        let eligibleRow = this.state.eligiblePositions[i][0];
                        let eligibleCol = this.state.eligiblePositions[i][1];
                        let newBoard = this.state.board.map(row => row.slice());

                        if(eligibleRow === row && eligibleCol === col){ 
                            let activePosition = this.state.activePosition;
                            let piece = this.state.board[activePosition[0]][activePosition[1]];
                            if(piece === Logics.PAWN && (row === 0 || row === 7)){
                                $('#piecesBox').css('display', 'block');
                                this.setState({
                                    pawnPromotionPos: [row, col]
                                });
                                break;
                            }

                            this.modifyCastlingCode() // modifies the castling codes [white ks, white qs, black ks, black qs] if king or rook moves
                            this.checkIfEnPassantIsUsed(col, row, newBoard) // check if en passant move was used, if so, removes the enemy pawn
                            this.modifyAdvancedPawnPos(row, col) // checks if pawn moved two spaces, if so, en passant may be used to attack this pawn

                            newBoard[row][col] = newBoard[this.state.activePosition[0]][this.state.activePosition[1]];
                            newBoard[this.state.activePosition[0]][this.state.activePosition[1]] = Logics.EMPTY;

                            this.setState({
                                board: newBoard
                            });

                            moveMade = true;
                            break;
                        }
                    }
                }
                if(moveMade){
                    this.endTurn();
                }
            }
        }
    }

    checkIfEnPassantIsUsed(col, row, newBoard) {
        let start = this.state.activePosition;
        if(Math.abs(this.state.board[start[0]][start[1]]) === Logics.PAWN){
            if (start[1] !== col && !Logics.positionContainsPiece(row, col, this.state.board)) {
                newBoard[start[0]][col] = Logics.EMPTY
            }
        }
    }

    modifyAdvancedPawnPos(row, col) {
        let start = this.state.activePosition
        let advancedPawn = false
        if (Math.abs(this.state.board[start[0]][start[1]]) === Logics.PAWN) {
            if (Math.abs(row - start[0]) === 2) {
                advancedPawn = true
            }
        }
        if (advancedPawn) {
            this.setState({
                advancedPawnPos: [row, col]
            })
        }
        else {
            this.setState({
                advancedPawnPos: [-1, -1]
            })
        }
    }

    modifyCastlingCode() {
        let start = this.state.activePosition
        let newCastlingCode = this.state.castlingCode;
        if (Math.abs(this.state.board[start[0]][start[1]]) === Logics.KING) {
            this.modifyCastlingCodeKingMovement(newCastlingCode)
        }

        else if (Math.abs(this.state.board[start[0]][start[1]]) === Logics.ROOK){
            // bottom left rook has moved
            this.modifyCastlingCodeRookMovement(start, newCastlingCode)
        }
        this.setState({
            castlingCode: newCastlingCode
        });
    }

    modifyCastlingCodeRookMovement(start, newCastlingCode) {
        let row = this.state.isWhite ? 7 : 0;
        if (start[0] === row && start[1] === 0) {
            if (this.state.isWhite) {
                newCastlingCode[1] = false
            }
            else {
                newCastlingCode[2] = false
            }
        }
        // bottom right rook has moved
        else if (start[0] === row && start[1] === 7) {
            if (this.state.isWhite) {
                newCastlingCode[0] = false
            }
            else {
                newCastlingCode[3] = false
            }
        }
    }

    modifyCastlingCodeKingMovement(newCastlingCode) {
        if (this.state.isWhite) {
            newCastlingCode[0] = false
            newCastlingCode[1] = false
        }
        else {
            newCastlingCode[2] = false
            newCastlingCode[3] = false
        }
    }

    queensideCastle(col) {
        let row = this.state.isWhite ? 7 : 0;
        let multiplier = this.state.isWhite ? 1 : -1;
        if (col === 2) {
            let newBoard = this.state.board.map(row => row.slice())
            newBoard[row][3] = Logics.ROOK * multiplier;
            newBoard[row][2] = Logics.KING * multiplier;
            newBoard[row][4] = Logics.EMPTY * multiplier;
            newBoard[row][0] = Logics.EMPTY * multiplier;
            this.setState({
                board: newBoard
            })
            return true;
        }
        return false;
    }

    kingsideCastle(col) {
        let row = this.state.isWhite ? 7 : 0;
        let multiplier = this.state.isWhite ? 1 : -1;
        if (col === 6) {
            let newBoard = this.state.board.map(row => row.slice());
            newBoard[row][5] = Logics.ROOK * multiplier;
            newBoard[row][6] = Logics.KING * multiplier;
            newBoard[row][4] = Logics.EMPTY * multiplier;
            newBoard[row][7] = Logics.EMPTY * multiplier;
            this.setState({
                board: newBoard
            })
            return true;
        }
        return false;
    }

    choosePiece(){
        let value = $('input[name=pawnPiece]:checked').val();
        let newBoard = this.state.board.map(row => row.slice());

        let multiplier = this.state.isWhite ? 1 : -1;

        let pos = this.state.activePosition;
        newBoard[pos[0]][pos[1]] = parseInt(value) * multiplier;

        console.log(pos);

        this.setState({
            board: newBoard
        });

        $('#piecesBox').css('display', 'none');
        $('input[name=pawnPiece]:checked').prop('checked', false);

        this.modifyAdvancedPawnPos(, col) // checks if pawn moved two spaces, if so, en passant may be used to attack this pawn
        this.setState({
            activePosition: [-1, -1]
        });
        this.endTurn();
    }

    startTurn(){
        this.setState({
            usersTurn: true,
            activePosition: [-1, -1],
            eligiblePositions: []
        });
    }

    endTurn(){
        this.setState({
            usersTurn: false,
            activePosition: [-1, -1],
            eligiblePositions: []
        }, this.sendCurrentStateToServer);
    }

    sendCurrentStateToServer(){
        let url = '/chess/send';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                let data = JSON.parse(xhr.responseText);

                let resBoard = data.board;
                let resCastlingCode = data.castlingCode;
                let resAdvancedPawnPos = data.advancedPawnPos;

                this.setState({
                    board: resBoard,
                    castlingCode: resCastlingCode,
                    advancedPawnPos: resAdvancedPawnPos
                }, this.startTurn());
            }
        }
        xhr.send(JSON.stringify({
            'board': this.state.board,
            'userIsWhite': this.state.isWhite,
            'castlingCode': this.state.castlingCode,
            'advancedPawnPos': this.state.advancedPawnPos
        }));
    }

    renderPiece(row, col){
        let piece = this.state.board[row][col];
        let src;

        switch(piece){
            case Logics.PAWN:
                src = whitePawn;
                break;
            case -Logics.PAWN:
                src = blackPawn;
                break;
            case Logics.KNIGHT:
                src = whiteKnight;
                break;
            case -Logics.KNIGHT: 
                src = blackKnight;
                break;
            case Logics.BISHOP:
                src =whiteBishop;
                break;
            case -Logics.BISHOP:
                src = blackBishop;
                break;
            case Logics.ROOK: 
                src = whiteRook;
                break;
            case -Logics.ROOK:
                src = blackRook;
                break;
            case Logics.QUEEN:
                src = whiteQueen;
                break;
            case -Logics.QUEEN:
                src = blackQueen;
                break;
            case Logics.KING:
                src = whiteKing;
                break;
            case -Logics.KING:
                src = blackKing;
                break;
            default:
                return <div></div>;
        }
        return <img src={src} className="pieceImg" alt='piece'/>;
    }

    renderBoard(){
        let rows = [];
        let lightBg = true;

        if(this.state.isWhite){
            for(let row = 0; row < 8; row++){
                let rowElements = [];
                for(let col = 0; col < 8; col++){
                    let element;
                    let tileColor = lightBg ? 'lightBg' : 'darkBg';

                    element = <div onClick={e => this.handleTileClick(row, col)} key={'tileClick' + row + col} className={'tile ' + tileColor}>{this.renderPiece(row, col)}</div>
                    
                    rowElements = [...rowElements, element]
                    lightBg = !lightBg;
                }
                rows = [...rows, <div key={"row" + row} className="boardRow">{rowElements}</div>]
                lightBg = !lightBg;
            }
        }
        else{
            for(let row = 7; row >= 0; row--){
                let rowElements = [];
                for(let col = 7; col >= 0; col--){
                    let element;
                    let tileColor = lightBg ? 'lightBg' : 'darkBg';

                    element = <div onClick={e => this.handleTileClick(row, col)} className={'tile ' + tileColor}>{this.renderPiece(row, col)}</div>
                    
                    rowElements = [...rowElements, element]
                    lightBg = !lightBg;
                }
                rows = [...rows, <div className="boardRow">{rowElements}</div>]
                lightBg = !lightBg;
            }
        }   
        return rows;
    }

    switchTeams(){
        this.setState({
            isWhite: !this.state.isWhite,
            activePosition: [-1, -1],
            eligiblePositions: []
        }, this.endTurn());
    }

    getInfo(){
        if(this.state.activePosition[0] !== -1){
            console.log('active: ' + this.state.activePosition);
            console.log('Pinned?: ' + Logics.getIfPinned(this.state.activePosition[0], this.state.activePosition[1], 
                this.state.isWhite, Logics.getNumOfChecks(this.state.isWhite, this.state.board), this.state.board));
        }
        console.log('board:');
        console.log(this.state.board);
        console.log('en passant:');
        console.log(this.state.advancedPawnPos);
        console.log('number of checks: ');
        console.log(Logics.getNumOfChecks(this.state.isWhite, this.state.board));
        console.log('Chosen piece: ' + this.state.chosenPiece);
        console.log('\n');
    }

    componentDidMount(){
        this.startTurn();
    }

    render() {
        return (
            <div>
                <div id="piecesBox" style={{"display": "none"}}>
                    <div className="row justify-content-center">
                        <input type='radio' id='knight' value={Logics.KNIGHT} name='pawnPiece' />
                        <label htmlFor="knight">Knight</label><br></br>
                    </div>

                    <div className="row justify-content-center">
                        <input type='radio' id='bishop' value={Logics.BISHOP} name='pawnPiece' />
                        <label htmlFor="bishop">Bishop</label><br></br>
                    </div>

                    <div className="row justify-content-center">
                        <input type='radio' id='rook' value={Logics.ROOK} name='pawnPiece' />
                        <label htmlFor="rook">Rook</label><br></br>
                    </div>

                    <div className="row justify-content-center">
                        <input type='radio' id='queen' value={Logics.QUEEN} name='pawnPiece' />
                        <label htmlFor="queen">Queen</label><br></br>
                    </div>

                    <div className="row justify-content-center">
                        <button onClick={this.choosePiece}>Choose Piece</button>
                    </div>
                    <br />
                </div>
                <div className="row justify-content-center">
                    <div id='board'>
                        {this.renderBoard()}
                    </div>
                </div>
                <div className="row justify-content-center">
                    <button className="btn btn-light" onClick={this.switchTeams}>Switch teams</button>
                    <button className="btn btn-light" onClick={this.getInfo}>Info</button>
                </div>
            </div>
        );
    }
}
