import React from 'react'
import ReactDOM from 'react-dom'

import FileTable from './components/FileTable'

class Files extends React.Component {

  render() {
    const files = [
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

    return (
      <div>
        <h1>Files</h1>
        <FileTable items={files}/>
        <button className="btn btn-large btn-primary">
          <span className="icon icon-plus"></span>
          Add new file
        </button>
      </div>
    );
  }
}

export default Files