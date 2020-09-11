import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Route, Switch } from 'react-router-dom';

import '../Stylesheets/App.css';

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
import LogIn from './LogIn';
import Register from './Register';

function App() {
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
          <Route path='/login' component={LogIn} />
          <Route path='/register' component={Register} />
          <Route component={Error} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
