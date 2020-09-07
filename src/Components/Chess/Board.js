import React from 'react';
import Tile from './Tile';
import * as Consts from './Constants';
import '../../Stylesheets/Chess/Board.css';

class Board extends React.Component {
    renderTiles(){
        let arr = [];
        let lightBackgroundFlag = true;

        let i = 0;

        let index = this.props.color === Consts.WHITE ? 63 : 0;
        let increment = this.props.color === Consts.WHITE ? -1 : 1;

        while(i < 64){
            let currRow = [];
            do{
                if(this.props.board[index] !== Consts.NONE){
                    currRow.push( <Tile key={'tile' + index} lightFlag={lightBackgroundFlag} 
                            onClickThrowback={this.props.onClickThrowback} index={index} piece={this.props.board[index]}/> );
                }
                else{
                    currRow.push( <Tile key={'tile' + index} onClickThrowback={this.props.onClickThrowback} index={index} 
                            lightFlag={lightBackgroundFlag}/> );
                }
                lightBackgroundFlag = !lightBackgroundFlag;
                i++;
                index += increment;
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