import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'


const Sidebar = () => (
  <nav className="nav-group">
    <Link to="/" className="nav-group-item">
      <span className="icon icon-folder"></span>
      Files
        </Link>
    <div className="nav-group-level-2">
      <Link to="/files/mine" className="nav-group-item">
        <span className="icon icon-folder"></span>
        My files
          </Link>
      <Link to="/files/shared-with-me" className="nav-group-item">
        <span className="icon icon-folder"></span>
        Shared with me
          </Link>
    </div>
    <Link to="/settings" className="nav-group-item">
      <span className="icon icon-cog"></span>
      Settings
        </Link>
  </nav>
)

export default Sidebar