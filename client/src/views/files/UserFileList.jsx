import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { FileTable, UploadQueue } from '.'
import * as Actions from '../../actions'

import RaisedButton from 'material-ui/RaisedButton'
import Add from 'material-ui/svg-icons/content/add'

import DropboxClient from '../../api/dropboxApi'
import authData from '../../../dropbox-auth.json'

import { remote } from 'electron'
const dialog = remote.dialog
const winston = remote.getGlobal('winston')

// named export. Useful for testing only component itself without store logic
export class UserFileList extends React.Component {

  constructor(params) {
    super(params);
    this.dropboxClient = new DropboxClient(authData.key, authData.secret);
  }

  componentDidMount() {
    if (this.props.files.length <= 0) {
      this.setFileListFromDropbox();
    }
  }

  setFileListFromDropbox() {
    return this
      .dropboxClient.authenticate().then(() => {
        winston.log('debug', 'Authentication successful');

        this.props.actions.setAuthStatus(true);

        this.dropboxClient.listFolder().then((result) => {
          let files = Array.from(result);
          this.handleListFolderResult(files);
          return files;
        }).catch((reject) => {
          winston.log('debug', reject.error)
        });
    });
  }

  handleListFolderResult(files) {
    if (files.length !== 0) {
      winston.log('debug', 'Found', files.length, 'file(s)');
      files.forEach(res => {
        winston.log('debug', '- Name: ', res.name)
      });
    } else {
      winston.log('debug', 'Found no files in app folder');
    }

    this.props.actions.setFiles(files);
  }

  openFileDialog() {
    // save refenrece to use in dialog callback
    let actions = this.props.actions;

    winston.log('debug', 'open dialog')

    dialog.showOpenDialog({
      properties: ['openFile']
    }, function(filePaths) {
      if (filePaths && filePaths.length > 0) {

        let filePath = filePaths[0]
        winston.log('debug', 'File chosen:', filePath)

        actions.addFileToUploadQueue({
          path: filePath
        });
      } else {
        winston.log('debug', 'No file chosen')
      }
    })
  }

  openDetailView(fileId) {
    this.props.actions.setDetail(fileId);
    this.context.router.push(`/files/${fileId}`);
  }

  handleFileUpload(file) {
    console.log("Send file to the clouds");
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <h2>Files</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <FileTable files={ this.props.files } onRowClick={ this.openDetailView.bind(this) } />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <UploadQueue files={ this.props.uploadQueue } onFileRemove={ this.props.actions.removeFileFromUploadQueue.bind(this) } onFileUpload={ this.handleFileUpload.bind(this) } />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <RaisedButton label={ 'Add file' } primary={ true } icon={ < Add /> } onClick={ () => this.openFileDialog() } />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

UserFileList.propTypes = {
  files: React.PropTypes.array.isRequired,
  uploadQueue: React.PropTypes.array.isRequired,
  actions: React.PropTypes.object,
  children: React.PropTypes.node
}

UserFileList.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    // key - props key value - which part of state to bind
    files: state.files.userFiles,
    uploadQueue: state.files.uploadQueue
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserFileList)