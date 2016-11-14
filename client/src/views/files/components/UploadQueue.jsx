import React from 'react'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'
import IconButton from 'material-ui/IconButton'
import Clear from 'material-ui/svg-icons/content/clear'
import CloudUpload from 'material-ui/svg-icons/file/cloud-upload'

import path from 'path'
import _ from 'lodash'

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
        <TableRowColumn>progressbar will be here</TableRowColumn>
        <TableRowColumn>
          <IconButton onClick={() => console.log("Remove from queue")}>
            <Clear/>
          </IconButton>
          <IconButton onClick={() => console.log("Send file to the clouds")}>
            <CloudUpload/>
          </IconButton>
        </TableRowColumn>
      </TableRow>
    )
  }

  render() {
    const files = this.props.files;
    const showCheckbox = false;

    if (files && files.length > 0) {
      return (
        <div>
          <h3>Upload queue</h3>
          <Table>
            <TableHeader displaySelectAll={showCheckbox} adjustForCheckbox={showCheckbox}>
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Progress</TableHeaderColumn>
                <TableHeaderColumn></TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={showCheckbox}>
              {(files && files.length > 0) && files.map((file, index) => (this.renderRow(index, file)))}
            </TableBody>
          </Table>
        </div>
      )
    } else {
      return null
    }
  }
}

UploadQueue.propTypes = {
  // files: React.PropTypes.array.isRequired
  files: React
    .PropTypes
    .arrayOf(React.PropTypes.shape({
      // id: React   .PropTypes   .oneOfType([React.PropTypes.string,
      // React.PropTypes.number])   .isRequired, name: React.PropTypes.string,
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
    .isRequired
}

export default UploadQueue