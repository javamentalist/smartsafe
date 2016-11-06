import React from 'react'
import ReactDOM from 'react-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {FileTable} from '.'
import {Button} from '../'
import * as FileActions from '../../actions'

import DropboxClient from '../../api/dropboxApi'
import authData from '../../../dropbox-auth.json'

import {remote} from 'electron'
const dialog = remote.dialog
const winston = remote.getGlobal('winston')

// named export. Useful for testing only component itself without store logic
export class MyFiles extends React.Component {

  constructor(params) {
    super(params);
    this.dropboxClient = new DropboxClient(authData.key, authData.secret);
  }

  componentDidMount() {
    this.setFileListFromDropbox();
  }

  setFileListFromDropbox() {
    return this
      .dropboxClient
      .authenticate()
      .then(() => {
        this
          .dropboxClient
          .listFolder()
          .then(result => {
            let files = Array.from(result);
            if (files.length !== 0) {
              files.forEach(res => {
                winston.log('debug', 'found file', res.name)
              });
            } else {
              winston.log('debug', 'oh shit', result);
            }

            this
              .props
              .actions
              .setFiles(files);

            return files;
          })
          .catch((e) => {
            winston.log('debug', e)
          });
      });
  }

  openFileDialog() {
    winston.log('debug', 'open dialog')
    dialog.showOpenDialog({
      properties: ['openFile']
    }, function (fileNames) {
      if (fileNames.length > 0) {
        winston.log('debug', 'file chosen:', fileNames[0])
      } else {
        winston.log('debug', 'no file chosen')
      }
    })
  }

  render() {
    return (
      <div>
        <h1>Files</h1>
        <FileTable files={this.props.files}/>
        <Button
          text={'Add file'}
          iconClass={'plus'}
          onClick={() => this.openFileDialog()}/>
      </div>
    )
  }
}

MyFiles.propTypes = {
  files: React.PropTypes.array.isRequired,
  actions: React.PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    // key - props key value - which part of state to bind
    files: state.files.myFiles
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(FileActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFiles)