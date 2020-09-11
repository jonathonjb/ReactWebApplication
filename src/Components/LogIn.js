import React from 'react'
import { Link, Redirect } from 'react-router-dom';

const xhr = new XMLHttpRequest();

class Login extends React.Component {
    constructor(props){
        super(props);

        this.passwordRef = React.createRef();
        this.state = {
            username: '',
            redirect: null
        }

        this.submission = this.submission.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
    }

    onChangeUsername(event){
        this.setState({
            username: event.target.value
        });
    }

    submission(){
        let url = '/login';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                let data = JSON.parse(xhr.responseText);
                if(data.status === 'success'){
                    this.setState({
                        redirect: '/'
                    });
                }
                else{
                    console.log('PROBLEM');
                }
            }
        }
        xhr.send(JSON.stringify({'username': this.state.username, 'password': this.passwordRef.current.value}));
    }

    render() {
        if(this.state.redirect){
            return <Redirect to={this.state.redirect} />
        }
        return (
            <div>
                <br />
                <div className='row justify-content-center'><h5>Log-in</h5></div>
                <div className='row justify-content-center'>
                    <form className='form-group' action='/login' method='POST'>
                        <label>Username: </label>
                        <input type='text' placeholder='username' name='username' onChange={this.onChangeUsername} required />
                        <br /><br />
                        <label>Password: </label>&nbsp;
                        <input type='password' placeholder='Enter password' name='password' ref={this.passwordRef} required />
                    </form>
                </div>

                <div className='row justify-content-center'>
                    <button className='btn btn-outline-dark' type='submit' onClick={this.submission}>Log-in</button>
                </div>
                <br /> 
                <div className='row justify-content-center'>
                    <Link to='/register'>Or sign-up!</Link>
                </div>
            </div>
        );
    }
}

export default Login;