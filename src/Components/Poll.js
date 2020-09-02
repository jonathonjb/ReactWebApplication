import React from 'react'
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
            for(let j = 0; j < choices.length; j++){
                choicesInputs = [...choicesInputs, <div key={this.state.groupName + j}>
                    <input type="radio" value={choices[j]} name={this.state.groupName}/><label>&nbsp;{choices[j]}</label><br />
                </div>]
            }
    
            let currDiv = <div key={this.state.groupName}>
                <br />
                <div className="row justify-content-center">
                    <div className="poll col-md-10">
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
                    choicesArray = [...choicesArray, <div>
                        {choices[i]}
                        <div className='progress'>
                            <div className='progress-bar' style={{"width": percentage + "%"}}></div>
                        </div>
                        {this.state.poll.votes[i]} votes
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
        console.log(value);
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