import React from 'react';
import * as Const from './Constants';

import blackPawn from '../../Images/Chess/blackPawn.png';
import whitePawn from '../../Images/Chess/whitePawn.png';
import blackKnight from '../../Images/Chess/blackKnight.png';
import whiteKnight from '../../Images/Chess/whiteKnight.png';
import blackBishop from '../../Images/Chess/blackBishop.png';
import whiteBishop from '../../Images/Chess/whiteBishop.png';
import blackRook from '../../Images/Chess/blackRook.png';
import whiteRook from '../../Images/Chess/whiteRook.png';
import blackQueen from '../../Images/Chess/blackQueen.png';
import whiteQueen from '../../Images/Chess/whiteQueen.png';
import blackKing from '../../Images/Chess/blackKing.png';
import whiteKing from '../../Images/Chess/whiteKing.png';

import '../../Stylesheets/Chess/Piece.css';

class Piece extends React.Component {
    constructor(props){
        super(props);

        this.getImageSource = this.getImageSource.bind(this);
    }

    getImageSource(){
        switch(this.props.piece){
            case Const.BLACK_PAWN:
                return blackPawn;
            case Const.WHITE_PAWN:
                return whitePawn;
            case Const.BLACK_KNIGHT:
                return blackKnight;
            case Const.WHITE_KNIGHT:
                return whiteKnight;
            case Const.BLACK_BISHOP:
                return blackBishop;
            case Const.WHITE_BISHOP:
                return whiteBishop;
            case Const.BLACK_ROOK:
                return blackRook;
            case Const.WHITE_ROOK:
                return whiteRook;
            case Const.BLACK_QUEEN:
                return blackQueen;
            case Const.WHITE_QUEEN:
                return whiteQueen;
            case Const.BLACK_KING:
                return blackKing
            case Const.WHITE_KING:
                return whiteKing;
            default:
                return '';
        }
    }

    render() {
        return (
            <div>
                <img className="imgPiece" alt='piece' src={this.getImageSource()} style={{'opacity': this.props.opacity}} />
            </div>
        );
    }
}

export default Piece;