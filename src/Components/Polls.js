import React from 'react'
import '../Stylesheets/Polls.css'
import $ from 'jquery'
import Poll from './Poll'

const xhr = new XMLHttpRequest();

class Polls extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            ids: [],
            questions: [],
            choices: [],
            polls: [],

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
        for(let i = 0; i < this.state.polls.length; i++){
            polls = [...polls, <Poll poll={this.state.polls[i]}/>];
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
                </div>
            </div>)
        }
        return choices;
    }

    clearPollingAreaStates(){
        this.setState({
            polls: []
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
            polls: [...this.state.polls, pollInstance]
        });
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
                this.clearPollingAreaStates();
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