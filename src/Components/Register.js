import React from 'react'
import { Redirect } from 'react-router-dom';

const xhr = new XMLHttpRequest();

class SignUp extends React.Component {
    constructor(props){
        super(props);
        this.passwordRef = React.createRef();
        this.passwordRepeatRef = React.createRef();
        this.state = {
            username: '',
            redirect: null
        }
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.submission = this.submission.bind(this);
    }

    onChangeUsername(event){
        this.setState({
            username: event.target.value
        });
    }
    
    submission(){
        let username = this.state.username;
        let password = this.passwordRef.current.value;
        let passwordRepeat = this.passwordRepeatRef.current.value;
        if(username.length < 5){
            console.log('username too short');
            return;
        }
        if(username.length > 20){
            return;
        }
        if(password.length < 5){
            return;
        }
        if(password !== passwordRepeat){
            return;
        }

        let url = '/register';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                let data = JSON.parse(xhr.responseText);
                if(data.status === 'success'){
                    this.setState({
                        redirect: '/login'
                    });
                }
                else{
                    console.log(data.message);
                }
            }
        }
        xhr.send(JSON.stringify({
            'username': username,
            'password': password
        }));
    }

    render(){
        if(this.state.redirect){
            return <Redirect to={this.state.redirect} />
        }
        return (
            <div>
                <br />
                <div className='row justify-content-center'><h5>Sign-up</h5></div>
                <div className='row justify-content-center'>
                    <form className='form-group' method='post' action='/signup/submit'>
                        <label>Username: </label>
                        <input type='text' placeholder='Enter Username' name='username' onChange={this.onChangeUsername} required />
                        <br /><br />
                        <label>Password: </label>&nbsp;
                        <input type='password' placeholder='Enter Password' name='password' ref={this.passwordRef} required />
                        <br /><br />
                        <label>Retype Password: </label>&nbsp;
                        <input type='password' placeholder='Retype Password' name='password' ref={this.passwordRepeatRef} required />
                        <br /><br />
                    </form>
                </div>
                <div className='row justify-content-center'>
                    <button className='btn btn-outline-dark' onClick={this.submission}>Sign-up</button>
                </div>
            </div>
        );
    }
}

export default SignUp;