import React from 'react';
import '../Stylesheets/Message.css';

class Message extends React.Component {
    render(){
        return (
            <div>
                <h6>{this.props.username}</h6>
                <div className="message-box rounded">
                    {this.props.message}
                </div>
            </div>
        );
    }
}

export default Message;