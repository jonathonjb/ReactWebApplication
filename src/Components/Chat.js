import React from 'react';
import '../Stylesheets/Chat.css';
import {connect} from 'react-redux';
import Message from './Message';

const  xhr = new XMLHttpRequest();

class Chat extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            usernames: [],
            messages: [],
            message: ""
        }
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.enterPressed = this.enterPressed.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
        this.clearChatBox = this.clearChatBox.bind(this);
        this.submitMessage = this.submitMessage.bind(this);
        this.getAllMessages = this.getAllMessages.bind(this);
        this.deleteAllMessages = this.deleteAllMessages.bind(this);
    }

    handleMessageChange(event){
        this.setState({
            message: event.target.value
        });
    }

    enterPressed(event){
        let key = event.key;
        if(key === 'Enter'){
            this.submitMessage(this.state.name, this.state.message);
        }
    }

    renderMessages(){
        let messages = [];
        for(let i = 0; i < this.state.messages.length; i++){
            let username = this.state.usernames[i];
            let message = this.state.messages[i];
            messages.push(<div><Message username={username} message={message}/><br /></div>);
        }
        return messages;
    }

    clearChatBox(){
        this.setState({
            usernames: [],
            messages: []
        });
    }

    submitMessage(){
        let url = '/chat/submit';
        xhr.open('POST', url, true); 
        xhr.setRequestHeader("Content-Type", "application/json"); 
    
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                // CHECK FOR SUCCESS
                this.clearChatBox();
                this.getAllMessages();
            }
        }
    
        let data = JSON.stringify({
            "message": this.state.message
        });
        xhr.send(data);
    }

    getAllMessages(){
        let url = '/chat/get_messages';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
    
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                let obj = JSON.parse(xhr.responseText);
                if(obj.status === "success"){
                    let usernames = [];
                    let messages = [];

                    let arrOfMessages = obj.data;
                    arrOfMessages.forEach(item => {
                        usernames.push(item.name);
                        messages.push(item.message);
                    });

                    this.setState({
                        usernames: usernames,
                        messages: messages
                    });
                }
                else{
                    console.log("CANNOT RETRIEVE MESSAGES");
                }
            }
        }
        xhr.send(null);
    }

    deleteAllMessages(){
        let url = '/chat/remove_all';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
    
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                let obj = JSON.parse(xhr.responseText);
                if(obj.status === "success"){
                    this.clearChatBox();
                }
                else{
                    console.log("CANNOT RETRIEVE MESSAGES");
                }
            }
        }
        xhr.send(null);
    }

    componentDidMount(){
        this.getAllMessages();
    }

    render() {
        return (
            <div>
                <br />
                <div className="row">
                    <div id='chat-box' className="offset-md-2 col-md-8 rounded shadow">
                        {this.renderMessages()}
                    </div>
                </div>
                <br />
                {
                    this.props.auth.loggedIn ?
                    <div>
                        <div className="row">
                            <textarea id='chat-message' onChange={this.handleMessageChange} onKeyPress={this.enterPressed.bind(this)} 
                                className="offset-md-2 col-md-8 rounded shadow" rows="3" />
                        </div>
                        <br />
                        <div className="row">
                            <button className='offset-md-2 btn btn-primary' onClick={this.submitMessage}>Submit</button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button className='btn btn-danger' onClick={this.deleteAllMessages}>Delete all</button>
                        </div>
                        <br/><br/><br/>
                    </div>
                    :
                    <div />
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(Chat);