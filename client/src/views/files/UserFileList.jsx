import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { FileTable, UploadQueue } from '.'
import * as Actions from '../../actions'

import RaisedButton from 'material-ui/RaisedButton'
import Add from 'material-ui/svg-icons/content/add'

// import DropboxClient from '../../api/dropboxApi'
import authData from '../../../dropbox-auth.json'


// Sens messages to main process (and can listen too)
import { ipcRenderer } from 'electron'


// named export. Useful for testing only component itself without store logic
export class UserFileList extends React.Component {

  constructor(params) {
    super(params);
    ipcRenderer.send('log-async', 'UserFileList created');
    this.setUpListeners();
  // this.dropboxClient = new DropboxClient(authData.key, authData.secret);
  }

  componentDidMount() {
    if (this.props.files.length <= 0) {
      // this.setFileListFromDropbox();
    }
  }

  setFileListFromDropbox() {
    return this
      .dropboxClient.authenticate().then(() => {
      ipcRenderer.send('log-async', 'debug', 'Authentication successful');
      // winston.log('debug', 'Authentication successful');

      this.props.actions.setAuthStatus(true);

      this.dropboxClient.listFolder().then((result) => {
        let files = Array.from(result);
        this.handleListFolderResult(files);
        return files;
      }).catch((reject) => {
        ipcRenderer.send('log-async', 'debug', reject.error);
      });
    });
  }

  handleListFolderResult(files) {
    if (files.length !== 0) {
      ipcRenderer.send('log-async', 'debug', `Found ${files.length} file(s)`);
      files.forEach(res => {
        ipcRenderer.send('log-async', 'debug', `- Name: ${res.name}`);
      });
    } else {
      ipcRenderer.send('log-async', 'debug', 'Found no files in app folder');
    }

    this.props.actions.setFiles(files);
  }

  openFileDialog() {
    ipcRenderer.send('open-file-dialog-async');
  }

  setUpListeners() {
    ipcRenderer.on('file-chosen-async', (event, filePath) => {
      this.props.actions.addFileToUploadQueue({path:filePath});
    })
  }

  openDetailView(fileId) {
    this.props.actions.setDetail(fileId);
    this.context.router.push(`/files/${fileId}`);
  }

  handleFileUpload(file) {
    console.log('Sending file to the clouds');
    ipcRenderer.send('log-async', 'debug', 'Sending file to the clouds');
    // ipcRenderer.on('asynchronous-reply', (event, arg) => {
    //   console.log(arg) // prints "pong"
    // })
    ipcRenderer.send('upload-file-async', file);
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