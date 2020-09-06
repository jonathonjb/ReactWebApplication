import React from 'react';
import Tile from './Tile';
import * as Consts from './Constants';
import '../../Stylesheets/Chess/Board.css';

class Board extends React.Component {
    renderTiles(){
        let arr = [];
        let i = 0;
        let lightBackgroundFlag = true;

        while(i < 64){
            let currRow = [];
            do{
                if(this.props.board[i] !== Consts.NONE){
                    currRow.push( <Tile key={'tile' + i} lightFlag={lightBackgroundFlag} 
                            onClickThrowback={this.props.onClickThrowback} index={i} piece={this.props.board[i]}/> );
                }
                else{
                    currRow.push( <Tile key={'tile' + i} onClickThrowback={this.props.onClickThrowback} index={i} 
                            lightFlag={lightBackgroundFlag}/> );
                }
                lightBackgroundFlag = !lightBackgroundFlag;
                i++;
            }
            while(i % 8 !== 0);

            lightBackgroundFlag = !lightBackgroundFlag;
            arr.push(<div key={'row' + i} className="row boardRow">
                {currRow}
            </div>);
        }

        return arr;
    }

    render() {
        return (
            <div id="board">
                {this.renderTiles()}
            </div>
        );
    }
}

export default Board;