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


export default class Chess extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            board: Logics.startPosition,
            isWhite: true,
            activePosition: [-1, -1],
            eligiblePositions: [],

            // the castling codes represents whether the king can castle. It represents castling at:
            // [white kingside, white queenside, black kingside, black queenside]
            castlingCode: [true, true, true, true], 

            // The position where a pawn just moved two spaces - the en passant move can be made to remove a pawn at this position.
            enPassantPos: [-1, -1]
        }

        this.renderPiece = this.renderPiece.bind(this);
        this.handleTileClick = this.handleTileClick.bind(this);
        this.switchTeams = this.switchTeams.bind(this);
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
        return <img src={src} className="pieceImg"/>;
    }

    handleTileClick(row, col){
        if(Logics.positionContainsUserPiece(row, col, this.state.isWhite, this.state.board)){
            this.setState({
                activePosition: [row, col],
                eligiblePositions: Logics.getEligiblePositions(row, col, this.state.board, this.state.castlingCode, this.state.enPassantPos)
            });
        }
        else{
            for(let i = 0; i < this.state.eligiblePositions.length; i++){
                if(this.state.eligiblePositions[i] === Logics.KINGSIDE_CASTLE){
                    // white
                    if(col === 6){
                        let newBoard = this.state.board.map(row => row.slice());
                        newBoard[7][5] = Logics.ROOK;
                        newBoard[7][6] = Logics.KING;
                        newBoard[7][4] = Logics.EMPTY;
                        newBoard[7][7] = Logics.EMPTY;
                        this.setState({
                            board: newBoard,
                            activePosition: [-1, -1],
                            eligiblePositions: []
                        });
                    }
                    // black
                    else if(col === 1){
                        let newBoard = this.state.board.map(row => row.slice());
                        newBoard[7][2] = -Logics.ROOK;
                        newBoard[7][1] = -Logics.KING;
                        newBoard[7][0] = Logics.EMPTY;
                        newBoard[7][3] = Logics.EMPTY;
                        this.setState({
                            board: newBoard,
                            activePosition: [-1, -1],
                            eligiblePositions: []
                        });
                    }
                }
                else if(this.state.eligiblePositions[i] === Logics.QUEENSIDE_CASTLE){
                    // white
                    if(col === 2){
                        let newBoard = this.state.board.map(row => row.slice());
                        newBoard[7][3] = Logics.ROOK;
                        newBoard[7][2] = Logics.KING;
                        newBoard[7][4] = Logics.EMPTY;
                        newBoard[7][0] = Logics.EMPTY;
                        this.setState({
                            board: newBoard,
                            activePosition: [-1, -1],
                            eligiblePositions: []
                        });
                    }
                    // black
                    else if(col === 5){
                        let newBoard = this.state.board.map(row => row.slice());
                        newBoard[7][4] = -Logics.ROOK;
                        newBoard[7][5] = -Logics.KING;
                        newBoard[7][3] = Logics.EMPTY;
                        newBoard[7][7] = Logics.EMPTY;
                        this.setState({
                            board: newBoard,
                            activePosition: [-1, -1],
                            eligiblePositions: []
                        });
                    }
                }

                else{
                    let eligibleRow = this.state.eligiblePositions[i][0];
                    let eligibleCol = this.state.eligiblePositions[i][1];
                    if(eligibleRow === row && eligibleCol === col){ 
                        let newBoard = this.state.board.map(row => row.slice());

                        newBoard[row][col] = newBoard[this.state.activePosition[0]][this.state.activePosition[1]];
                        newBoard[this.state.activePosition[0]][this.state.activePosition[1]] = Logics.EMPTY;

                        this.setState({
                            board: newBoard,
                            activePosition: [-1, -1],
                            eligiblePositions: []
                        });

                    break;
                    }
                }
            }
        }
    }

    renderBoard(){
        let rows = [];
        let lightBg = true;
        for(let row = 0; row < 8; row++){
            let rowElements = [];
            for(let col = 0; col < 8; col++){
                let element;
                let tileColor = lightBg ? 'lightBg' : 'darkBg';

                element = <div onClick={e => this.handleTileClick(row, col)} className={'tile ' + tileColor}>{this.renderPiece(row, col)}</div>
                
                rowElements = [...rowElements, element]
                lightBg = !lightBg;
            }
            rows = [...rows, <div className="boardRow">{rowElements}</div>]
            lightBg = !lightBg;
        }
        return rows;
    }

    switchTeams(){
        let newBoard = [];
        for(let i = 7; i >= 0; i--){
            newBoard.push(this.state.board[i].slice().reverse());
        }
        this.setState({
            board: newBoard,
            isWhite: !this.state.isWhite
        });
    }

    render() {
        return (
            <div>
                <div className="row justify-content-center">
                    <div id='board'>
                        {this.renderBoard()}
                    </div>
                </div>
                <div className="row justify-content-center">
                    <button className="btn btn-light" onClick={this.switchTeams}>Switch teams</button>
                </div>
            </div>
        );
    }
}
