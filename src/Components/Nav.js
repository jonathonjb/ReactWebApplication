import React from 'react';
import '../Stylesheets/Nav.css';
import { Link } from 'react-router-dom';
import 'bootstrap/js/dist/collapse';
import $ from 'jquery';
import 'react-redux';
import {login, logout} from '../ActionCreators/actionCreators';
import {connect} from 'react-redux';

class Nav extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            activeId: 'home'
        }
        this.changeActive = this.changeActive.bind(this);
        this.testClick = this.testClick.bind(this);
    }

    changeActive(event){
        $("#" + this.state.activeId).removeClass('active');
        $('#' + event.target.id).addClass('active');
        this.setState({
            activeId: event.target.id
        });
    }

    testClick(){
        if(this.props.auth.loggedIn){
            console.log("LOGGING OUT");
            this.props.logout();
        }
        else{
            console.log("LOGGING IN");
            this.props.login();
        }
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
                            <Link to='/logout' className="nav-link" id='logout' onClick={this.changeActive}>Log-Out</Link> :
                            <Link to='/login' className="nav-link" id='login' onClick={this.changeActive}>Log-In</Link> }
                    </li>
            

                    <li className='nav-item' onClick={this.testClick} style={{'color': 'white'}}>
                        QUICK LOGIN/LOGOUT
                    </li>
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
    login, 
    logout
}


export default connect(mapStateToProps, mapDispatchToProps)(Nav);