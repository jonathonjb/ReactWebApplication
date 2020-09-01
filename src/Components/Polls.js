import React from 'react'
import '../Stylesheets/Polls.css'
import $ from 'jquery'

const xhr = new XMLHttpRequest();

class Polls extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            ids: [],
            questions: [],
            choices: [],

            numChoiceTextareas: 2,
            questionValue: "",
            choiceTextareaValues: ["", ""]
        }

        this.renderPollingArea = this.renderPollingArea.bind(this);
        this.renderChoiceTextareas = this.renderChoiceTextareas.bind(this);

        this.addChoice = this.addChoice.bind(this);
        this.removeChoice = this.removeChoice.bind(this);

        this.questionOnChange = this.questionOnChange.bind(this);
        this.choiceOnChange = this.choiceOnChange.bind(this);

        this.clearPollingAreaStates = this.clearPollingAreaStates.bind(this);
        this.clearNewPollStates = this.clearNewPollStates.bind(this);

        this.addPollInstance = this.addPollInstance.bind(this);
        this.sendPollInstance = this.sendPollInstance.bind(this);
        this.getAllPollInstances = this.getAllPollInstances.bind(this);
        this.deleteAllPollInstances = this.deleteAllPollInstances.bind(this);
        this.sendPollSubmit = this.sendPollSubmit.bind(this);

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    addChoice(){
        this.setState({
            numChoiceTextareas: this.state.numChoiceTextareas + 1,
            choiceTextareaValues: [...this.state.choiceTextareaValues, ""]
        });
    }

    removeChoice(){
        let newChoiceTextareaValues = [];
        for(let i = 0; i < this.state.choiceTextareaValues.length - 1; i++){
            newChoiceTextareaValues = [...newChoiceTextareaValues, this.state.choiceTextareaValues[i]];
        }

        this.setState({
            numChoiceTextareas: this.state.numChoiceTextareas - 1,
            choiceTextareaValues: newChoiceTextareaValues
        });
    }

    /**
     * Renders the area where the polls are shown. This creates an element which inlucdes all of the poll boxes and returns it.
     */
    renderPollingArea(){
        let polls = [];
        for(let i = 0; i < this.state.ids.length; i++){
            let choices = this.state.choices[i];
            let choicesInputs = [];

            let groupName = "Poll" + i;
            for(let j = 0; j < choices.length; j++){
                choicesInputs = [...choicesInputs, <div key={groupName + j}>
                    <input type="radio" value={choices[j]} name={groupName}/><label>&nbsp;{choices[j]}</label><br />
                </div>]
            }

            let currDiv = <div key={groupName}>
                <br />
                <div className="row justify-content-center">
                    <div className="poll col-md-10" id={this.state.ids[i]}>
                        <h4><b>{this.state.questions[i]}</b></h4> {/* Prints out the poll Quesion on the top of the poll box */}
                        <form>{choicesInputs}</form> {/* Prints out each of the choices amongside a radio button */}
                        <center><button className="btn" onClick={() => {this.sendPollSubmit(this.state.ids[i], groupName)}}><b>
                            Submit</b></button></center>
                    </div>
                </div>
            </div>
            polls = [...polls, currDiv];
        }

        return polls;
    }

    /**
     * Renders the textboxes which allows the user to type in the 'choices' to a question they want to create.
     */
    renderChoiceTextareas(){
        let choices = [];
        for(let i = 0; i < this.state.numChoiceTextareas; i++){
            choices.push(<div key={"ChoiceArea" + i}>
                <br />
                <div className="row justify-content-center">
                    <textarea id={i + "ChoiceTA"} rows="1" className="col-6 choiceTextarea" 
                        onChange={this.choiceOnChange} placeholder="Choice" />
                        {this.state.choiceTextareaValues[i]}
                </div>
            </div>)
        }
        return choices;
    }

    clearPollingAreaStates(){
        this.setState({
            ids: [],
            questions: [],
            choices: []
        });
    }

    clearNewPollStates(){
        this.setState({
            numChoiceTextareas: 2,
            questionValue: "",
            choiceTextareaValues: ["", ""]
        });
    }

    questionOnChange(event){
        this.setState({
            questionValue: event.target.value
        });
    }

    choiceOnChange(event){
        // the id of the choice textareas are always '<NUM>Choices' Ex: 0Choices, 1Choices, 2Choices, etc...
        let targetId = event.target.id;
        let char = targetId.charAt(0)
        let index = parseInt(char);
        let value = event.target.value;

        let newChoiceTextareaValues = this.state.choiceTextareaValues
        newChoiceTextareaValues[index] = value
        this.setState({
            choiceTextareaValues: newChoiceTextareaValues
        });
    }

    addPollInstance(pollInstance){
        this.setState({
            ids: [...this.state.ids, pollInstance._id],
            questions: [...this.state.questions, pollInstance.question],
            choices: [...this.state.choices, pollInstance.choices]
        });
    }

    sendPollSubmit(pollId, groupName){
        let value = $('input[name=' + groupName + ']:checked').val()
        let url = '/polls/submit';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                let obj = JSON.parse(xhr.responseText).data;
                console.log(obj);

                let reducer = (total, num) => {return total + num};
                let totalVotes = obj.votes.reduce(reducer);


            }
        }
        xhr.send(JSON.stringify({"id": pollId, "choice": value}));
    }

    sendPollInstance(){
        let url = '/polls/create_poll';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                // TODO: MAKE SURE CREATION HAS SUCCEEDED

                this.clearNewPollStates();
                this.clearPollingAreaStates();
                this.getAllPollInstances();
            }
        }
        xhr.send(JSON.stringify({
            "question": this.state.questionValue,
            "choices": this.state.choiceTextareaValues
        }));

    }

    getAllPollInstances(){
        let url = '/polls/get_polls';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                let obj = JSON.parse(xhr.responseText);
                let data = obj.data;
                for(let i = 0; i < data.length; i++){
                    this.addPollInstance(data[i]);
                }
            }
        }
        xhr.send(null);
    }

    deleteAllPollInstances() {
        let url = '/polls/delete_polls';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                this.setState({
                    ids: [],
                    questions: [],
                    choices: []
                });
            }
        }
        xhr.send(null);
    }

    componentDidMount(){
        this.getAllPollInstances();
    }

    render() {
        return (
            <div>
                <div id='pollingArea'>
                    {this.renderPollingArea()}
                </div>
                <br />




                <div className="row justify-content-center">
                    <textarea rows="1" className="col-10" onChange={this.questionOnChange} placeholder="Question" />
                </div>

                <div className="choiceTextareaSpace">
                    {this.renderChoiceTextareas()}
                </div>
            
        

                <br />
                <div className="row justify-content-center">
                    <button className="btn btn-primary" onClick={this.addChoice}>Add Choice</button> &nbsp;
                    <button className="btn btn-primary" onClick={this.removeChoice}>Remove Choice</button> &nbsp;
                    <button className="btn btn-success" onClick={this.sendPollInstance}>Create Question</button> &nbsp;
                    <button className="btn btn-danger" onClick={this.deleteAllPollInstances}>Delete All</button>
                </div>
            </div>
        )
    }
}

export default Polls;