import React from 'react'
import {render} from 'react-dom'
import {Link} from 'react-router'

class Sidebar extends React.Component {

  render() {
    return (
      <nav className="nav-group">
        <span className="nav-group-item">
          <Link to="/">
            <span className="icon icon-folder"></span>
            Files
          </Link>
        </span>
        <span className="nav-group-item">
          <Link to="/settings">
            <span className="icon icon-cog"></span>
            Settings
          </Link>
        </span>
      </nav>
    );
  }

}

export default Sidebar
