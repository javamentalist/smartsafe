import React from 'react'
import { render } from 'react-dom'

import { Sidebar } from '.'

export default class App extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="col-xs-3 col-md-2 sidebar">
          <Sidebar/>
        </div>
        <div className="col-xs-9 col-md-10">
          { /* Actual content */ }
          { this.props.children }
        </div>
      </div>
    )
  }
}
