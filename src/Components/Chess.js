import React from 'react';

import Board from './Chess/Board';
import * as Consts from './Chess/Constants';
import * as BoardTk from './Chess/BoardToolKit'
import '../Stylesheets/Chess/Chess.css'
import { generateMoves } from './Chess/MoveGenerator';

class Chess extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            board: Consts.START_POS
        }

        this.onClick = this.onClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    onClick(index) {
        console.log('clicked on title: ' + index);
        console.log(BoardTk.positionStatus(index, Consts.WHITE, this.state.board));
    }

    componentDidMount(){
        generateMoves(Consts.WHITE, this.state.board);
    }

    render(){
        return (
            <div>
                <div className="row justify-content-center">
                    <Board board={this.state.board} onClickThrowback={this.onClick}/>
                </div>
            </div>
        )
    }
}

export default Chess