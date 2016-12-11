import React from 'react';
import { Sidebar } from '.';
import { Footer } from '.';

import { ipcRenderer } from 'electron';

export default class App extends React.Component {

    componentDidMount() {
        ipcRenderer.send('app-loaded');
    }

    render() {
        return (
            <div>
              <div className="row row--no-margin row--stretch-to-bottom app-wrap">
                <div className="col-xs-3 col-md-2 sidebar">
                  <Sidebar/>
                </div>
                <div className="col-xs-9 col-md-10 content">
                  { /* Actual content */ }
                  { this.props.children }
                </div>
              </div>
              <Footer/>
            </div>
            );
    }
}

App.propTypes = {
    children: React.PropTypes.node
};
