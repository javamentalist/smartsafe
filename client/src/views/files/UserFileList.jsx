import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { FileTable, UploadQueue } from '.'
import * as Actions from '../../actions'

import RaisedButton from 'material-ui/RaisedButton'
import Add from 'material-ui/svg-icons/content/add'

// Sends messages to main process (and can listen too)
import { ipcRenderer } from 'electron'

// named export. Useful for testing only component itself without store logic
export class UserFileList extends React.Component {

  constructor(params) {
    super(params);
    this.setUpListeners();
  }

  componentDidMount() {
    if (this.props.files.length <= 0) {
      console.log('asking fo files')
      ipcRenderer.send('get-files-from-dropbox-async');
    }
  }

  setUpListeners() {
    ipcRenderer.on('file-chosen-async', (event, filePath) => {
      this.props.actions.addFileToUploadQueue({
        path: filePath
      });
    });

    ipcRenderer.on('set-dropbox-files-async', (event, files) => {
      console.log(files);
      this.props.actions.setFiles(files);
    });

    ipcRenderer.on('file-upload-started-async', (event, file) => {
      this.props.actions.setStartUpload(file);
    });
    ipcRenderer.on('file-upload-finished-async', (event, file) => {
      this.props.actions.setUploadFinished(file);
    });
  }

  openFileDialog() {
    ipcRenderer.send('open-file-dialog-async');
  }

  // We don't currently want to show file details on row click
  openDetailView(fileId) {
    return false;
  // this.props.actions.setDetail(fileId);
  // this.context.router.push(`/files/${fileId}`);
  }

  handleFileUpload(file) {
    ipcRenderer.send('log-async', 'debug', 'Sending file to the clouds');
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