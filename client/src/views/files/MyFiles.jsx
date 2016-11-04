import React from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import winston from 'winston'

import { FileTable } from '.'
import { Button } from '../'
import DropboxClient from '../../api/dropboxApi'

import * as FileActions from '../../actions'


class MyFiles extends React.Component {

  render() {
    return (
      <div>
        <h1>Files</h1>
        <FileTable files={this.props.files} />
        <Button text={'Add file'} iconClass={'plus'} onClick={() => FileActions.openFileDialog()} />
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
  return bindActionCreators(FileActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyFiles)