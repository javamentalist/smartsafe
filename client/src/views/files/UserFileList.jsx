import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { FileTable, UploadQueue } from '.';
import * as Actions from '../../actions';

import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Add from 'material-ui/svg-icons/content/add';
import Refresh from 'material-ui/svg-icons/navigation/refresh';

// Sends messages to main process (and can listen too)
import { ipcRenderer } from 'electron';

// named export. Useful for testing only component itself without store logic
export class UserFileList extends React.Component {

  constructor(params) {
    super(params);
    this.setUpListeners();
    this.setUpClickHandlers();
  }

  componentDidMount() {
    if (this.props.files.length <= 0) {
      console.log('asking fo files');
      ipcRenderer.send('get-files-from-dropbox-async');
    }
  }

  setUpListeners() {
    ipcRenderer.on('file-chosen-async', (event, filePath) => {
      this.props.actions.addFileToUploadQueue({
        path: filePath
      });
    });

    ipcRenderer.on('set-dropbox-loading-status-async', (event, status) => {
      this.props.actions.setLoadingStatus(status);
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

  setUpClickHandlers() {
    this.refreshDropbox = this.refreshDropbox.bind(this);
    this.openFileDialog = this.openFileDialog.bind(this);
    this.openDetailView = this.openDetailView.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleFileDelete = this.handleFileDelete.bind(this);
    this.handleFileDownload = this.handleFileDownload.bind(this);
    this.props.actions.removeFileFromUploadQueue = this.props.actions.removeFileFromUploadQueue.bind(this);
  }

  refreshDropbox() {
    ipcRenderer.send('get-files-from-dropbox-async');
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

  handleFileDelete(file) {
    ipcRenderer.send('log-async', 'debug', 'Deleting file from Dropbox');
    ipcRenderer.send('delete-file-async', file);
  }

  handleFileDownload(file) {
    ipcRenderer.send('log-async', 'debug', 'Downloading file from Dropbox');
    ipcRenderer.send('download-file-async', file);
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="row bottom-xs">
            <div className="col-xs-10">
              <h2>Files</h2>
            </div>
            <div className="col-xs-2 center-xs">
              <FloatingActionButton onClick={ this.refreshDropbox }>
                <Refresh />
              </FloatingActionButton>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <FileTable files={ this.props.files } onRowClick={ this.openDetailView } onFileDelete={ this.handleFileDelete } onFileDownload={ this.handleFileDownload } isLoading={ this.props.isLoading }/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <UploadQueue files={ this.props.uploadQueue } onFileRemove={ this.props.actions.removeFileFromUploadQueue } onFileUpload={ this.handleFileUpload } />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <RaisedButton label={ 'Add file' } primary icon={ < Add /> } onClick={ this.openFileDialog } />
            </div>
          </div>
        </div>
      </div>
      );
  }
}

UserFileList.propTypes = {
  isLoading: React.PropTypes.bool.isRequired,
  files: React.PropTypes.array.isRequired,
  uploadQueue: React.PropTypes.array.isRequired,
  actions: React.PropTypes.object,
  children: React.PropTypes.node
};

UserFileList.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    // key - props key value - which part of state to bind
    isLoading: state.files.isLoading,
    files: state.files.userFiles,
    uploadQueue: state.files.uploadQueue
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserFileList);
