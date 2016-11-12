import React from 'react'
import ReactDOM from 'react-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import {FileTable} from '.'
import {Button} from '../'
import * as Actions from '../../actions'

import DropboxClient from '../../api/dropboxApi'
import authData from '../../../dropbox-auth.json'

import {remote} from 'electron'
const dialog = remote.dialog
const winston = remote.getGlobal('winston')

// named export. Useful for testing only component itself without store logic
export class FileList extends React.Component {

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
        winston.log('debug', 'Authentication successful');

        this
          .props
          .actions
          .setAuthStatus(true);

        this
          .dropboxClient
          .listFolder()
          .then((result) => {
            let files = Array.from(result);
            this.handleListFolderResult(files);
            return files;
          })
          .catch((reject) => {
            winston.log('debug', reject.error)
          });
      });
  }

  handleListFolderResult(files) {

    if (files.length !== 0) {
      winston.log('debug', 'Found', files.length, 'files');
      files.forEach(res => {
        winston.log('debug', '- Name: ', res.name)
        console.log(res)
      });
    } else {
      winston.log('debug', 'Found no files in app folder');
    }

    this
      .props
      .actions
      .setFiles(files);
  }

  openFileDialog() {
    winston.log('debug', 'open dialog')
    dialog.showOpenDialog({
      properties: ['openFile']
    }, function (fileNames) {
      if (fileNames && fileNames.length > 0) {
        let file = fileNames[0]
        winston.log('debug', 'File chosen:', file)
      } else {
        winston.log('debug', 'No file chosen')
      }
    })
  }

  render() {
    return (
      <div>
        <h1>Files</h1>
        <FileTable files={this.props.files} onRowClick={this.props.actions.setDetail}/>
        <Button
          text={'Add file'}
          iconClass={'plus'}
          onClick={() => this.openFileDialog()}/> {this.props.children}
      </div>
    )
  }
}

FileList.propTypes = {
  files: React.PropTypes.array.isRequired,
  actions: React.PropTypes.object
}

const mapStateToProps = (state) => {
  return {
    // key - props key value - which part of state to bind
    files: state.files.userFiles
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileList)