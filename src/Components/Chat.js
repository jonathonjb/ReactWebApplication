import React from 'react'
import '../Stylesheets/Chat.css'

const  xhr = new XMLHttpRequest();

const clearChatBox = () => {
    let chatBox = document.getElementById('chat-box');
    while(chatBox.firstChild){
        chatBox.removeChild(chatBox.firstChild);
    }
}

const submitMessage = (name, message) => {
    console.log('SUMMITING - name:' + name + ', message: ' + message);
    let url = '/chat/message_submit';
    xhr.open('POST', url, true); 
    xhr.setRequestHeader("Content-Type", "application/json"); 

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200){
            // CHECK FOR SUCCESS
            clearChatBox();
            getAllMessages();
        }
    }

    let data = JSON.stringify({
        "name": name,
        "message": message
    });
    xhr.send(data);
}

const getAllMessages = () => {
    let url = '/chat/get_messages';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200){
            let obj = JSON.parse(xhr.responseText);
            if(obj.status === "success"){
                let arrOfMessages = obj.data;
                let chatBox = document.getElementById('chat-box');

                arrOfMessages.forEach((item) => {
                    let name = item.name;
                    let message = item.message;
                    let newDiv = document.createElement('div');
                    newDiv.classList.add('message-box');
                    newDiv.classList.add('rounded');
                    newDiv.innerHTML = "<i>" + name + "</i> <br/>" + message;
                    chatBox.appendChild(newDiv);
                    chatBox.appendChild(document.createElement('br'));
                });
                chatBox.appendChild(document.createElement('br'));
            }
            else{
                console.log("CANNOT RETRIEVE MESSAGES");
            }
        }
    }
    xhr.send(null);
}

const deleteAllMessages = () => {
    let url = '/chat/remove_all';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200){
            let obj = JSON.parse(xhr.responseText);
            if(obj.status === "success"){
                clearChatBox();
            }
            else{
                console.log("CANNOT RETRIEVE MESSAGES");
            }
        }
    }
    xhr.send(null);
}


class Chat extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: "Anonymous",
            message: ""
        }
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
    }

    handleNameChange(event){
        this.setState({
            name: event.target.value
        });
    }

    handleMessageChange(event){
        this.setState({
            message: event.target.value
        });
    }

    componentDidMount(){
        getAllMessages();
    }

    render() {
        return (
            <div>
                <br />
                <div className="row">
                    <div id='chat-box' className="col-md-8 rounded shadow">
                        {/*test*/}
                        {/*<div className="message-box">Name<br />Hi there, my name is Jonathon Brandt! How are you doing today? Me, I'm doing fine. I'm watching some playoffs basketball. I really fucking hope the bucks win lol.</div>
                        */}
                    </div>
                </div>
                <br />
                <div className="row">
                    <textarea id='chat-name'  onChange={this.handleNameChange} className="col-md-2 rounded shadow" placeholder="Name" rows="1"/>
                    <div className="col-md-1"/>
                    <textarea id='chat-message' onChange={this.handleMessageChange} className="col-md-5 rounded shadow" rows="3" />
                </div>
                <br />
                <div className="row">
                    <button className='btn btn-primary' onClick={() => submitMessage(this.state.name, this.state.message)}>Submit</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <button className='btn btn-danger' onClick={deleteAllMessages}>Delete all</button>
                </div>
            </div>
        )
    }
}

export default Chat;