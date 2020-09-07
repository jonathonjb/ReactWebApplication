import React from 'react';
import Piece from './Piece';
import '../../Stylesheets/Chess/Tile.css';

class Tile extends React.Component {
    render(){
        return (
            <div className={this.props.lightFlag ? 'lightBackground tile' : 'darkBackground tile'} 
                        onClick={e => this.props.onClickThrowback(this.props.index)}>
                {this.props.piece !== undefined ? <Piece piece={this.props.piece} /> : ''}
                {this.props.piece === undefined ? this.props.index : ''}
            </div>
        );
    }
}

export default Tile