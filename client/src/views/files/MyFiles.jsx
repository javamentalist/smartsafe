import React from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import winston from 'winston'

import { FileTable } from '.'
import { Button } from '../'
import DropboxClient from '../../api/dropboxApi'

import * as FileActions from '../../actions'

import authData from '../../../dropbox-auth.json'


class MyFiles extends React.Component {


  constructor(params) {
    super(params)
    this.dropboxClient = new DropboxClient(authData.key, authData.secret);

  }

  componentDidMount() {
    this.getFileListFromDropbox().then((data) => {
      console.log(data);
    }, (reason) => {
      console.log("whoops", reason);
    })
  }

  getFileListFromDropbox() {
    return this.dropboxClient.authenticate().then(() => {
      this.dropboxClient.listFolder().then(result => {
        let files = Array.from(result);
        if (files.length !== 0) {
          files.forEach(res => {
            logError(res.name)
          });
        } else {

        }
        logError("oh" + result);
        return files;
      }).catch(e => logError(e));
    });
  }

  render() {
    return (
      <div>
        <h1>Files</h1>
        <FileTable files={this.props.files} />
        <Button
          text={'Add file'}
          iconClass={'plus'}
          onClick={() => this.props.actions.openFileDialog()} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // key - props key
    // value - which part of state to bind
    files: state.files.myFiles
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(FileActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFiles)