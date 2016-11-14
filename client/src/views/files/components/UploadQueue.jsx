import React from 'react'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'
import LinearProgress from 'material-ui/LinearProgress'
import IconButton from 'material-ui/IconButton'
import Clear from 'material-ui/svg-icons/content/clear'
import CloudUpload from 'material-ui/svg-icons/file/cloud-upload'

import path from 'path'
import _ from 'lodash'

const tableStyle = {
  tableLayout: 'auto',
  boxSizing: 'border-box'
}
const progressColStyle = {
  width: '30%',
  minWidth: '200px',
  maxWidth: '300px'
}
const actionsColStyle = {
  width: '100px',
  padding: 0
}

//const UploadQueue = ({files}) => (
class UploadQueue extends React.Component {

  renderRow(index, file) {
    const name = path.basename(file.path);
    const dir = path.dirname(file.path);
    return (
      <TableRow key={name} selectable={false}>
        <TableRowColumn>{name}<br/>
          <small>{dir}</small>
        </TableRowColumn>
        <TableRowColumn style={progressColStyle}>
          {/*<LinearProgress mode="determinate" value={this.state.completed} />*/}
          <LinearProgress mode="indeterminate"/>
        </TableRowColumn>
        <TableRowColumn style={actionsColStyle}>
          <IconButton onClick={() => this.props.onFileRemove(index)}>
            <Clear/>
          </IconButton>
          <IconButton onClick={() => this.props.onFileUpload(file)}>
            <CloudUpload/>
          </IconButton>
        </TableRowColumn>
      </TableRow>
    )
  }

  render() {
    const files = this.props.files;
    const showCheckbox = false;

    // if (files && files.length > 0) {
    return (
      <div>
        <h3>Upload queue</h3>
        {(files && files.length > 0)
          ? <Table style={tableStyle}>
              <TableHeader displaySelectAll={showCheckbox} adjustForCheckbox={showCheckbox}>
                <TableRow>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn style={progressColStyle}>Progress</TableHeaderColumn>
                  <TableHeaderColumn style={actionsColStyle}></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={showCheckbox}>
                {(files && files.length > 0) && files.map((file, index) => (this.renderRow(index, file)))}
              </TableBody>
            </Table>
          : <p>Queue is empty</p>}
      </div>
    )

  }
}

UploadQueue.propTypes = {
  files: React
    .PropTypes
    .arrayOf(React.PropTypes.shape({
      path: React.PropTypes.string.isRequired,
      progress: function (props, propName, componentName) {
        const value = props[propName];
        if (!_.isUndefined(value) && !_.isNumber(value)) {
          return new Error(`Invalid prop '${propName}' supplied to '${componentName}' (${value}). Should be number. Validation failed.`)
        }
        if (value < 0 || value > 100) {
          return new Error('Invalid prop `' + propName + '` supplied to `' + componentName + '`. Should be between 0 and 100 (inclusive). Validation failed.')
        }
      }
    }))
    .isRequired,
  onFileRemove: React.PropTypes.func.isRequired,
  onFileUpload: React.PropTypes.func.isRequired
}

export default UploadQueue