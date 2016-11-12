// Main index file (named app-index.js because index.js was taken)

import React from 'react';
import {render} from 'react-dom';
import {Router, hashHistory} from 'react-router';
import routes from './routes';

import {Provider} from 'react-redux';
import {createStore} from 'redux'
import rootReducer from './reducers'

// TODO read initial state from localstorage
const initialState = {
  // files: name given to fileReducer in when combining reducers
  files: {
    userFiles: []
  },
  user: {
    isAuthenticated: false
  }
}

let store = createStore(rootReducer, initialState)

const Root = ({store}) => (
  <Provider store={store}>
    <Router history={hashHistory} routes={routes}/>
  </Provider>
)

render(
  <Root store={store}/>, document.getElementById('root'));

Root.propTypes = {
  store: React.PropTypes.object.isRequired
}
