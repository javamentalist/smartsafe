import React from 'react'
import ReactDOM from 'react-dom'
import FlatButton from 'material-ui/FlatButton'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as Actions from '../../actions'
import {formatDate} from '../../utils/displayUtils'

// named export. Useful for testing only component itself without store logic
export class FileDetail extends React.Component {

  constructor(params) {
    super(params);
  }

  renderPageTitle(file) {
    return (
      <div className="row">
        <div className="col-xs-12">
          {file && <h2>{file.name}</h2>}
        </div>
      </div>
    );
  }

  renderFileInfo(file) {
    return (
      <div>
        <div className="row">
          <div className="col-xs-3">
            <strong>Id</strong>
          </div>
          <div className="col-xs-9">{file.id}</div>
        </div>
        <div className="row">
          <div className="col-xs-3">
            <strong>Name</strong>
          </div>
          <div className="col-xs-9">{file.name}</div>
        </div>
        <div className="row">
          <div className="col-xs-3">
            <strong>Path</strong>
          </div>
          <div className="col-xs-9">{file.path_display}</div>
        </div>
        <div className="row">
          <div className="col-xs-3">
            <strong>Client modified</strong>
          </div>
          <div className="col-xs-9">{formatDate(file.client_modified)}</div>
        </div>
        <div className="row">
          <div className="col-xs-3">
            <strong>Server modified</strong>
          </div>
          <div className="col-xs-9">{formatDate(file.server_modified)}</div>
        </div>
      </div>
    );
  }

  renderSharedInfo(file) {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <h3>Shared with</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <p style={{"color": "red"}}>Here be sharing info</p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    let file = this.props.file;
    console.log(file)
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-2">
              <FlatButton
                label="Back"
                icon={< ArrowBack />}
                onClick={() => {
                this
                  .context
                  .router
                  .push('/files');
              }}/>
            </div>
          </div>
          {file
            ? this.renderPageTitle(file)
            : <h2>No file</h2>}
          {file && this.renderFileInfo(file)}
          {file && this.renderSharedInfo(file)}
        </div>
      </div>
    )
  }
}

FileDetail.propTypes = {
  file: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object
}

FileDetail.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    // key - props key value - which part of state to bind
    file: state.files.detailedFile
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileDetail)