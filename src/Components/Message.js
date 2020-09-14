import React from 'react';
import '../Stylesheets/Message.css';

class Message extends React.Component {
    render(){
        return (
            <div className="row">
                {this.props.userMessage ? 
                    <div className="userMessageContainer">
                        <h6>{this.props.username}</h6>
                        <div className="message-box rounded userMessage">
                            {this.props.message}
                        </div>
                    </div>
                    :
                    <div className="messageContainer">
                        <h6>{this.props.username}</h6>
                        <div className="message-box rounded">
                            {this.props.message}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Message;