// Main index file (named app-index.js because index.js was taken)

import React from 'react';
import {render} from 'react-dom';
import {Router, hashHistory} from 'react-router';
import routes from './routes';

import {Provider} from 'react-redux';
import {createStore} from 'redux'
import rootReducer from './reducers'

import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {deepOrange500, deepOrange700, blueA200} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Needed for onTouchTap http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// TODO read initial state from localstorage
const initialState = {
  // files: name given to fileReducer in when combining reducers
  files: {
    userFiles: [],
    detailedFile: {},
    uploadQueue: []
  },
  user: {
    isAuthenticated: false
  }
}

let store = createStore(rootReducer, initialState)

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: deepOrange500,
    primary2Color: deepOrange700,
    accent1Color: blueA200
  }
});

const Root = ({store}) => (
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router history={hashHistory} routes={routes}/>
    </MuiThemeProvider>
  </Provider>
)

render(
  <Root store={store}/>, document.getElementById('root'));

Root.propTypes = {
  store: React.PropTypes.object.isRequired
}
