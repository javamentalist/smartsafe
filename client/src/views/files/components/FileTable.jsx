import React from 'react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import { lightGreen300, green700, red300, red700, grey100 } from 'material-ui/styles/colors'

import { formatBytes, formatDate } from '../../../utils/displayUtils'


class FileTable extends React.Component {
  renderStatusIcon(file) {
    if (!file.status || file.status == 'unprotected') {
      return (
        <IconButton>
          <FontIcon className="fa fa-chain-broken" />
        </IconButton>
      )
    } else if (file.status == 'protected') {
      return (
        <IconButton>
          <FontIcon className="fa fa-chain" color={ green700 } />
        </IconButton>
      )
    } else if (file.status == 'faulty') {
      return (
        <IconButton>
          <FontIcon className="fa fa-warning" color={ red700 } />
        </IconButton>
      )
    }
  }

  render() {
    let files = this.props.files;
    let onRowClick = this.props.onRowClick;

    const showCheckbox = false;

    return (
      <Table>
        <TableHeader displaySelectAll={ showCheckbox } adjustForCheckbox={ showCheckbox } enableSelectAll={ false }>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Size</TableHeaderColumn>
            <TableHeaderColumn>Client modified</TableHeaderColumn>
            <TableHeaderColumn>Server modified</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={ false }>
          { /*onMouseUp={ () => onRowClick(file.id) }*/ }
          { (files && files.length > 0)
            ? files.map((file) => (
              <TableRow key={ file.id } selectable={ false } style={ { backgroundColor: (file.status == 'protected') ? lightGreen300 : ((file.status == 'faulty') ? red300 : grey100) } }>
                <TableRowColumn>
                  { file.name }
                </TableRowColumn>
                <TableRowColumn>
                  { formatBytes(file.size) }
                </TableRowColumn>
                <TableRowColumn>
                  { formatDate(file.client_modified) }
                </TableRowColumn>
                <TableRowColumn>
                  { formatDate(file.server_modified) }
                </TableRowColumn>
                <TableRowColumn>
                  { this.renderStatusIcon(file) }
                </TableRowColumn>
              </TableRow>
            ))
            : <TableRow>
                <TableRowColumn colSpan="5" style={ { textAlign: 'center' } }>No files</TableRowColumn>
              </TableRow> }
        </TableBody>
      </Table>
    )
  }
}

FileTable.propTypes = {
  files: React.PropTypes.array.isRequired,
  onRowClick: React.PropTypes.func.isRequired
}

export default FileTable