import React from 'react'
import ReactDOM from 'react-dom'

// import winston from 'winston'

import FileTable from './components/file-table'
import AddFileButton from './components/add-file-button'
import DropboxClient from '../../api/dropboxApi'

class Files extends React.Component {

  getFileList() {   DropboxClient.listFolder(); }

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

    // const files = this.getFileList();

    return (
      <div>
        <h1>Files</h1>
        <FileTable items={files}/>
        <AddFileButton/>
      </div>
    );
  }
}

export default Files