import React from 'react';
import ReactDOM from 'react-dom';
import './Stylesheets/index.css';
import App from './Components/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './store';


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={configureStore()}> 
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
