import React from 'react';
import { render } from 'react-dom';

// Other imports Component class
export default class Settings extends React.Component {

  // render method is most important render method returns JSX template
  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
            <h2>Files</h2>
        </div>
      </div>
    );
  }
}
