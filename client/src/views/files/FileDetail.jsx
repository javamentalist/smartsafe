import React from 'react'
import ReactDOM from 'react-dom'
import FlatButton from 'material-ui/FlatButton'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as Actions from '../../actions'

// named export. Useful for testing only component itself without store logic
export class FileDetail extends React.Component {

  constructor(params) {
    super(params);
  }

  render() {
    let file = this.props.file
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
                  .goBack();
              }}/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              {file
                ? <h2>{file.name}</h2>
                : <h2>No file</h2>}
            </div>
          </div>
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