import React from 'react';
import '../Stylesheets/Nav.css';
import ComicPhoto from "../Images/comic_self.png";
import { Link } from 'react-router-dom';

function Nav() {
    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
            {/* Brand */}
            <Link to='/' className="navbar-brand">
                <img src={ComicPhoto} alt="Logo" style={{width: '50px'}} />
            </Link>
        
            {/* Links */}
            <ul className="navbar-nav">

                <li className="nav-item">
                    <Link to='/chess' className="nav-link">Chess</Link>
                </li>
        
                {/* Dropdown */}
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" data-toggle="dropdown">
                        Projects
                    </a>
                        <div className="dropdown-menu">
                            <Link to='/projects/zombies' className="dropdown-item">Zombies</Link>
                            <Link to='/projects/language_classifier' className="dropdown-item">Language Classifier</Link>
                            <Link to='/projects/path_finder' className="dropdown-item">Path Finder</Link>
                        </div>  
                </li>

                <li className="nav-item">
                <Link to='/chat' className="nav-link">Chat</Link>
                </li>

                <li className="nav-item">
                <Link to='/polls' className="nav-link">Polls</Link>
                </li>

                <li className="nav-item">
                <Link to='/resume' className="nav-link">Resume</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Nav