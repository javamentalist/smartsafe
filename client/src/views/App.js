import React from 'react'
import {render} from 'react-dom'

import Sidebar from './components/sidebar'

class App extends React.Component {

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

export default App
