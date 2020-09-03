import React from 'react'
import '../Stylesheets/Poll.css'
import $ from 'jquery'

const xhr = new XMLHttpRequest();

export default class Poll extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            poll: props.poll, /* poll contains the following: 'choices', 'votes', '_id', 'question' and 'date' */
            groupName: props.poll._id + "group",
            hasVoted: false,
            totalVotes: 0
        }

        this.renderPoll = this.renderPoll.bind(this);
        this.sendPollSubmit = this.sendPollSubmit.bind(this);
    }

    renderPoll(){
        let choices = this.state.poll.choices;
        let choicesInputs = [];

        // creates a list of 'choice' radio buttons
        if(!this.state.hasVoted){
            for(let i = 0; i < choices.length; i++){
                choicesInputs = [...choicesInputs, <div key={this.state.groupName + i}>
                    <input type="radio" value={choices[i]} name={this.state.groupName}/><label>&nbsp;{choices[i]}</label><br />
                </div>]
            }
    
            let currDiv = <div key={this.state.groupName}>
                <br />
                <div className="row justify-content-center">
                    <div className="poll col-md-10 rounded shadow">
                        <h4><b>{this.state.poll.question}</b></h4> 
                        <form>{choicesInputs}</form>
                        <center><button className="btn" onClick={() => {this.sendPollSubmit()}}><b>
                            Submit</b></button></center>
                    </div>
                </div>
            </div>
    
            return currDiv;
        }
        else{
            let choicesArray = [];
                for(let i = 0; i < choices.length; i++){
                    let percentage = 100 * (this.state.poll.votes[i] / this.state.totalVotes);
                    choicesArray = [...choicesArray, <div key={this.state.groupName + "voted" + i} className="row">
                        <div className="col-md-2">{choices[i]}</div>
                        <div className="col-md-8">
                            <div className='progress'>
                                <div className='progress-bar progress-bar-striped bg-info' style={{"width": percentage + "%"}}></div>
                            </div>
                        </div>
                        <div className="col-md-2">{this.state.poll.votes[i]} votes</div>
                    </div>]
                }

                let currDiv = 
                    <div>
                        <br />
                        <div className="row justify-content-center">
                            <div className="poll col-md-10">
                                <h4><b>{this.state.poll.question}</b></h4>
                                {choicesArray}
                            </div>
                        </div>
                    </div>
            return currDiv;
        }
    }

    sendPollSubmit(){
        let value = $('input[name=' + this.state.groupName + ']:checked').val();
        let url = '/polls/submit';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                let obj = JSON.parse(xhr.responseText).data;

                let reducer = (total, num) => {return total + num};
                let totalVotes = obj.votes.reduce(reducer);

                this.setState({
                    poll: obj,
                    totalVotes: totalVotes,
                    hasVoted: true
                });
            }
        }
        xhr.send(JSON.stringify({"id": this.state.poll._id, "choice": value}));
    }

    render(){
        return (
            <div>
                {this.renderPoll()}
            </div>
        );
    }
}