import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Route, Switch } from 'react-router-dom';
import {connect} from 'react-redux';

import '../Stylesheets/App.css';
import {login, logout} from '../ActionCreators/actionCreators';

import Nav from './Nav';

import Home from './Home';
import Chess from './Chess';
import LanguageClassifier from './Projects/LanguageClassifier';
import PathFinder from './Projects/PathFinder';
import Zombies from './Projects/Zombies';
import Chat from './Chat';
import NewChat from './NewChat';
import Polls from './Polls';
import Resume from './Resume';
import Login from './Login';
import Logout from './Logout';
import Register from './Register';

const xhr = new XMLHttpRequest();

class App extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        let url = '/';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                let data = JSON.parse(xhr.responseText);
                let isAuthenticated = data.authenticated;
                console.log(isAuthenticated);
                if(isAuthenticated){
                    this.props.login();
                }
                else{
                    this.props.logout();
                }
            }
        }
        xhr.send(null);
    }
    
    render() {
        return (
            <div className="App">
                <Nav /> 
                <div className="container">
                    <Switch>
                        <Route path='/' component={Home} exact />
                        <Route path='/chess' component={Chess} />
                        <Route path='/projects/language_classifier' component={LanguageClassifier} />
                        <Route path='/projects/path_finder' component={PathFinder} />
                        <Route path='/projects/zombies' component={Zombies} />
                        <Route path='/chat' component={Chat} />
                        <Route path='/newchat' component={NewChat} />
                        <Route path='/polls' component={Polls} />
                        <Route path='/resume' component={Resume} />
                        <Route path='/login' component={Login} />
                        <Route path='/logout' component={Logout} />
                        <Route path='/register' component={Register} />
                        <Route component={Error} />
                </Switch>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = {
    login,
    logout
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
