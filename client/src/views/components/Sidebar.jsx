import React from 'react';
import { Link } from 'react-router';
import FontIcon from 'material-ui/FontIcon';

const Sidebar = () => (
    <div>
      <div className="logo__border">
        <div className="logo__icon"></div>
      </div>
      <nav>
        <Link to="/">
        <FontIcon className="fa fa-folder-o nav__nav-icon" /> Files
        </Link>
        <Link to="/settings">
        <FontIcon className="fa fa-cogs nav__nav-icon" /> Settings
        </Link>
      </nav>
    </div>
);

export default Sidebar;