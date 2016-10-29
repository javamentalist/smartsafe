import React from 'react'
import {render} from 'react-dom'

import {Router, Route, IndexRoute, Link, hashHistory} from 'react-router'

import Sidebar from './components/sidebar'

import Files from './screens/files'
import Settings from './screens/settings'
// TODO use separate file for routes import routes from '../../config/routes'
// Other imports Component class
class App extends React.Component {

  // render method is most important render method returns JSX template
  render() {
    return (
      <div className="pane-group">
        <div className="pane pane-sm sidebar">
          <Sidebar/>
        </div>
        <div className="pane">
          {/* Actual content */}
          {this.props.children}
        </div>
      </div>
    );
  }
}

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Files}/>
    <Route path="settings" component={Settings}/>
  </Route>
)

render((<Router history={hashHistory} routes={routes}/>), document.getElementById('content'))
