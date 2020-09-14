import React from 'react';
import '../Stylesheets/Nav.css';
import { Link } from 'react-router-dom';
import 'bootstrap/js/dist/collapse';
import $ from 'jquery';
import 'react-redux';
import {logout} from '../ActionCreators/actionCreators';
import {connect} from 'react-redux';

const xhr = new XMLHttpRequest();

class Nav extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            activeId: 'home'
        }
        this.changeActive = this.changeActive.bind(this);
        this.logoutFromServer = this.logoutFromServer.bind(this);
    }

    changeActive(event){
        $("#" + this.state.activeId).removeClass('active');
        $('#' + event.target.id).addClass('active');
        this.setState({
            activeId: event.target.id
        });
    }

    logoutFromServer(){
        let url = '/logout';
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                let data = JSON.parse(xhr.responseText);
                if(data.status === 'success'){
                    console.log('logged out');
                    this.props.logout();
                }
                else{
                    console.error('problem logging out');
                }
            }
        }
        xhr.send(null);
    }

    render() {
        return (
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                {/* Links */}
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to='/' className="nav-link active" id='home' onClick={this.changeActive}>Home</Link>
                    </li>

                    <li className="nav-item">
                        <Link to='/chess' className="nav-link" id='chess' onClick={this.changeActive}>Chess</Link>
                    </li>
            
                    {/* Dropdown */}
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" data-toggle="dropdown">
                            Projects
                        </a>
                            <div className="dropdown-menu">
                                <Link to='/projects/zombies' id='zombies'onClick={this.changeActive} className="dropdown-item">Zombies</Link>
                                <Link to='/projects/language_classifier' id='languageClassifier' onClick={this.changeActive} className="dropdown-item">Language Classifier</Link>
                                <Link to='/projects/path_finder' id='pathFinder' onClick={this.changeActive} className="dropdown-item">Path Finder</Link>
                            </div>  
                    </li>

                    <li className="nav-item">
                    <Link to='/chat' className="nav-link" id='chat' onClick={this.changeActive}>Chat</Link>
                    </li>

                    <li className="nav-item">
                    <Link to='/newchat' className="nav-link" id='newchat' onClick={this.changeActive}>New Chat</Link>
                    </li>

                    <li className="nav-item">
                    <Link to='/polls' className="nav-link" id='polls' onClick={this.changeActive}>Polls</Link>
                    </li>

                    <li className="nav-item">
                    <Link to='/resume' className="nav-link" id='resume' onClick={this.changeActive}>Resume</Link>
                    </li>

                    <li className="nav-item">
                        {this.props.auth.loggedIn ? 
                            <div style={{'cursor': 'pointer'}}className="nav-link" id='logout' onClick={this.logoutFromServer}>Log-Out</div> :
                            <Link to='/login' className="nav-link" id='login' onClick={this.changeActive}>Log-In</Link> }
                    </li>

                    {this.props.auth.username !== null ? 

                        <li className="nav-item">
                            <div style={{'cursor': 'pointer', 'display': 'block', 'padding': '.5rem 1rem', 'color': 'rgba(255,255,255,.5)'}}id='username'>
                                {this.props.auth.username}
                            </div> 
                        </li>
                        :
                        <div />}
                </ul>
            </nav>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = {
    logout
}


export default connect(mapStateToProps, mapDispatchToProps)(Nav);