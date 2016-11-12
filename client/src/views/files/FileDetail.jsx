import React from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as Actions from '../../actions'


// named export. Useful for testing only component itself without store logic
export class FileDetail extends React.Component {

  constructor(params) {
    super(params);
  }

  render() {
    return <div>
      <Link to="/files">Back</Link>
      File details: {this.props.params.fileId}</div>
  }
}

FileDetail.propTypes = {
  file: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object
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