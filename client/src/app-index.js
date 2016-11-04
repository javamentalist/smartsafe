// Main index file. This is referenced by watchify

import React from 'react';
import { render } from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from './routes';

import { Provider } from 'react-redux';
import { createStore } from 'redux'
import rootReducer from './reducers'


// TODO read initial state from localstorage
const initialState = {
  // files: name given to fileReducer in when combining reducers
  files: {
    myFiles: [
      {
        id: 1,
        shared: 1,
        name: 'File 1'
      }, {
        id: 2,
        shared: null,
        name: 'File 2'
      }, {
        id: 3,
        shared: 5,
        name: 'File 3'
      }, {
        id: 4,
        shared: 0,
        name: 'File 4'
      }
    ]
  }
}

let store = createStore(rootReducer, initialState)

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={hashHistory} routes={routes} />
  </Provider>
)

render(<Root store={store} />, document.getElementById('root'));
