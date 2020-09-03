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
 * Ex: PAWN = white pawn, -QUEEN = black queen, -BISHOP = black bishop, KING = white king, etc...
 * 
 * EMPTY (0) means there is no pieces at this area.
 */

const EMPTY = 0;
const PAWN = 1;
const KNIGHT = 2;
const BISHOP = 3;
const ROOK = 4;
const QUEEN = 5;
const KING = 6;

export default class Chess extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            board: [
                [-ROOK, -KNIGHT, -BISHOP, -QUEEN, -KING, -BISHOP ,-KNIGHT, -QUEEN],
                [-PAWN, -PAWN, -PAWN, -PAWN, -PAWN, -PAWN, -PAWN, -PAWN],
                [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], 
                [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], 
                [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], 
                [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], 
                [PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN, PAWN],
                [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP ,KNIGHT, QUEEN]
            ],
            activePosition: [-1, -1],
            eligiblePositions: []
        }

        this.renderPiece = this.renderPiece.bind(this);
    }

    renderPiece(row, col){
        let piece = this.state.board[row][col];
        let src;

        switch(piece){
            case PAWN:
                src = whitePawn;
                break;
            case -PAWN:
                src = blackPawn;
                break;
            case KNIGHT:
                src = whiteKnight;
                break;
            case -KNIGHT: 
                src = blackKnight;
                break;
            case BISHOP:
                src =whiteBishop;
                break;
            case -BISHOP:
                src = blackBishop;
                break;
            case ROOK: 
                src = whiteRook;
                break;
            case -ROOK:
                src = blackRook;
                break;
            case QUEEN:
                src = whiteQueen;
                break;
            case -QUEEN:
                src = blackQueen;
                break;
            case KING:
                src = whiteKing;
                break;
            case -KING:
                src = blackKing;
                break;
            default:
                return <div></div>;
        }
        return <img src={src} className="pieceImg"/>;
    }

    renderBoard(){
        let rows = [];
        let lightBg = true;
        for(let row = 0; row < 8; row++){
            let rowElements = [];
            for(let col = 0; col < 8; col++){
                let element;
                if(lightBg){
                    element = <div className="tile lightBg">{this.renderPiece(row, col)}</div>
                }
                else{
                    element = <div className="tile darkBg">{this.renderPiece(row, col)}</div>
                }
                
                rowElements = [...rowElements, element]
                lightBg = !lightBg;
            }
            rows = [...rows, <div className="boardRow">{rowElements}</div>]
            lightBg = !lightBg;
        }
        return rows;
    }

    render() {
        return (
            <div className="row justify-content-center">
                <div id='board'>
                    {this.renderBoard()}
                </div>
            </div>
        );
    }
}
