import React from 'react';

import Board from './Chess/Board';
import * as Consts from './Chess/Constants';
import * as BoardTk from './Chess/BoardToolKit'
import '../Stylesheets/Chess/Chess.css'
import { generateMoves } from './Chess/MoveGenerator';

const xhr = new XMLHttpRequest();

class Chess extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            color: Consts.WHITE,
            board: Consts.START_POS,
            castlingCodes: Consts.START_CASTLING_CODE,
            enPassantPos: -1,

            moves: null,

            activePosition: -1
        }

        this.onClick = this.onClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.startTurn = this.startTurn.bind(this);
        this.endTurn = this.endTurn.bind(this);
        this.getInfo = this.getInfo.bind(this);
        this.moveOnBoard = this.moveOnBoard.bind(this);
        this.switchTeams = this.switchTeams.bind(this);
    }

    onClick(index) {
        let status = BoardTk.positionStatus(this.state.color, index, this.state.board);
        if(status === Consts.STATUS_SAME_COLOR){
            this.setState({
                activePosition: index
            });
        }
        else if(this.state.activePosition >= 0){
            if(this.checkIfMoveIsValid(index)){
                this.moveOnBoard(index);
            }
        }
    }

    checkIfMoveIsValid(newPosition){
        let moves = this.state.moves;
        let activePositionMoves = moves.get(this.state.activePosition);

        if(activePositionMoves !== undefined && activePositionMoves.has(newPosition)){
            return true;
        }
        return false;
    }

    moveOnBoard(newPosition){
        let newBoard = this.state.board.slice();
        newBoard[newPosition] = newBoard[this.state.activePosition];
        newBoard[this.state.activePosition] = Consts.NONE;
        let newCastlingCodes = this.state.castlingCodes;
        let newEnPassentPos = -1;

        this.addChangesIfMoveWasACastle(newPosition, newBoard, newCastlingCodes);
        this.addChangesIfEnPassantWasUsed(newPosition, newBoard);
        this.modifyCastlingCodes(newPosition, newBoard, newCastlingCodes);

        if(BoardTk.isTeamsPawn(this.state.color, newPosition, newBoard)){
            if(Math.abs(this.state.activePosition - newPosition) === 16){
                newEnPassentPos = newPosition + (-1 * BoardTk.forwardValue(this.state.color));
            }
        }

        this.setState({
            board: newBoard,
            activePosition: -1,
            castlingCodes: newCastlingCodes,
            enPassantPos: newEnPassentPos
        }, () => this.endTurn());
    }

    addChangesIfEnPassantWasUsed(newPosition, newBoard) {
        if (newPosition === this.state.enPassantPos) {
            if (BoardTk.isTeamsPawn(this.state.color, newPosition, newBoard)) {
                newBoard[newPosition + (-1 * BoardTk.forwardValue(this.state.color))] = Consts.NONE;
            }
        }
    }

    modifyCastlingCodes(newPosition, newBoard, newCastlingCodes) {
        if (BoardTk.isTeamsRook(this.state.color, newPosition, newBoard)) {
            // modify castlingCodes if user moved peviously unmoved rook
            // white kingside rook
            if (newCastlingCodes[0] === true && this.state.activePosition === 0) {
                newCastlingCodes[0] = false;
            }
            // white queenside rook
            else if (newCastlingCodes[1] === true && this.state.activePosition === 7) {
                newCastlingCodes[1] = false;
            }
            // black kingside rook
            else if (newCastlingCodes[2] === true && this.state.activePosition === 56) {
                newCastlingCodes[2] = false;
            }
            // black queenside rook
            else if (newCastlingCodes[3] === true && this.state.activePosition === 63) {
                newCastlingCodes[3] = false;
            }
        }
        else if (BoardTk.isTeamsKing(this.state.color, newPosition, newBoard)) {
            if (this.state.color === Consts.WHITE) {
                newCastlingCodes[0] = false;
                newCastlingCodes[1] = false;
            }
            else if (this.state.color === Consts.BLACK) {
                newCastlingCodes[2] = false;
                newCastlingCodes[3] = false;
            }
        }
    }

    addChangesIfMoveWasACastle(newPosition, newBoard, newCastlingCodes) {
        if (BoardTk.isTeamsKing(this.state.color, newPosition, newBoard) && Math.abs(newPosition - this.state.activePosition) === 2) {
            // white kingside castle 
            if (newPosition === 1) {
                newBoard[0] = Consts.NONE;
                newBoard[2] = Consts.WHITE_ROOK;
            }
            // white queenside castle
            else if (newPosition === 5) {
                newBoard[7] = Consts.NONE;
                newBoard[4] = Consts.WHITE_ROOK;
            }
            // black kingside castle
            else if (newPosition === 57) {
                newBoard[56] = Consts.NONE;
                newBoard[58] = Consts.BLACK_ROOK;
            }
            else if (newPosition === 61) {
                newBoard[63] = Consts.NONE;
                newBoard[60] = Consts.BLACK_ROOK;
            }
            else {
                console.error("Problem with king movement; castling was assumed, but not gotten");
            }
        }
    }

    startTurn(){
        this.setState({
            moves: generateMoves(this.state.color, this.state.board, this.state.castlingCodes, this.state.enPassantPos)
        });
    }

    endTurn(){
        this.sendCurrentStateToServer();
    }

    sendCurrentStateToServer(){
        let url = '/chess/send';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                let data = JSON.parse(xhr.responseText);
                this.setState({
                    board: data.board,
                    castlingCodes: data.castlingCodes,
                    enPassantPos: data.enPassantPos
                }, () => this.startTurn());
            }
        }
        xhr.send(JSON.stringify({
            board: this.state.board,
            aiColor: this.state.color === Consts.WHITE ? Consts.BLACK : Consts.WHITE,
            castlingCodes: this.state.castlingCodes,
            enPassantPos: this.state.enPassantPos
        }));
    }

    getInfo(){
        console.log('board: ');
        BoardTk.printBoard(this.state.board);

        console.log('active position:');
        console.log(this.state.activePosition);

        console.log('castling codes: ');
        console.log(this.state.castlingCodes);

        console.log('en passant: ');
        console.log(this.state.enPassantPos);

        console.log('generated moves: ');
        console.log(this.state.moves);
    }

    switchTeams(){
        let newColor = this.state.color === Consts.WHITE ? Consts.BLACK : Consts.WHITE;
        this.setState({
            color: newColor
        }, () => this.endTurn());
    }

    componentDidMount(){
        this.startTurn();
    }

    render(){
        return (
            <div>
                <div className="row justify-content-center">
                    <Board board={this.state.board} color={this.state.color} onClickThrowback={this.onClick}/>
                </div>
                <br />
                <div className="row justify-content-center">
                    <button className="btn btn-primary" onClick={this.switchTeams}>Switch Teams</button>&nbsp;&nbsp;
                    <button className="btn btn-info" onClick={this.getInfo}>Info</button>
                </div>
            </div>
        )
    }
}

export default Chess