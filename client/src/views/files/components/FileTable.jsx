import React from 'react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import { lightGreen300, green700, red300, red700, grey100 } from 'material-ui/styles/colors'

import { formatBytes, formatDate } from '../../../utils/displayUtils'


const tableStyle = {
  tableLayout: 'auto'
}
const deleteColStyle = {
  width: '75px',
  padding: 0
}
const nameColStyle = {

}
const sizeColStyle = {
  width: '10%',
  maxWidth: '100px'
}
const modColStyle = {
  width: '20%',
  maxWidth: '200px'
}
const statusColStyle = {
  width: '100px',
  padding: 0,
  textAlign: 'center'
}

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
    let onFileDelete = this.props.onFileDelete;
    let isLoading = this.props.isLoading;

    const showCheckbox = false;

    return (
      <Table style={ tableStyle }>
        <TableHeader displaySelectAll={ showCheckbox } adjustForCheckbox={ showCheckbox } enableSelectAll={ false }>
          <TableRow>
            <TableHeaderColumn style={ deleteColStyle }></TableHeaderColumn>
            <TableHeaderColumn style={ nameColStyle }>Name</TableHeaderColumn>
            <TableHeaderColumn style={ sizeColStyle }>Size</TableHeaderColumn>
            <TableHeaderColumn style={ modColStyle }>Client modified</TableHeaderColumn>
            <TableHeaderColumn style={ modColStyle }>Server modified</TableHeaderColumn>
            <TableHeaderColumn style={ statusColStyle }>Status</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={ false }>
          { /*onMouseUp={ () => onRowClick(file.id) }*/ }
          { isLoading &&
            <TableRow>
              <TableRowColumn colSpan="6" style={ { textAlign: 'center' } }>Loading</TableRowColumn>
            </TableRow> }
          { (!isLoading && files && files.length > 0) &&
            files.map((file) => (
              <TableRow key={ file.id } selectable={ false } style={ { backgroundColor: (file.status == 'protected') ? lightGreen300 : ((file.status == 'faulty') ? red300 : grey100) } }>
                <TableRowColumn style={ deleteColStyle }>
                  <IconButton onClick={ () => onFileDelete(file) }>
                    <Delete/>
                  </IconButton>
                </TableRowColumn>
                <TableRowColumn style={ nameColStyle }>
                  { file.name }
                </TableRowColumn>
                <TableRowColumn style={ sizeColStyle }>
                  { formatBytes(file.size) }
                </TableRowColumn>
                <TableRowColumn style={ modColStyle }>
                  { formatDate(file.client_modified) }
                </TableRowColumn>
                <TableRowColumn style={ modColStyle }>
                  { formatDate(file.server_modified) }
                </TableRowColumn>
                <TableRowColumn style={ statusColStyle }>
                  { this.renderStatusIcon(file) }
                </TableRowColumn>
              </TableRow>
            )) }
          { !isLoading && (!files || files.length <= 0) &&
            <TableRow>
              <TableRowColumn colSpan="6" style={ { textAlign: 'center' } }>No files</TableRowColumn>
            </TableRow> }
        </TableBody>
      </Table>
    )
  }
}

FileTable.propTypes = {
  files: React.PropTypes.array.isRequired,
  onRowClick: React.PropTypes.func.isRequired,
  onFileDelete: React.PropTypes.func.isRequired,
  isLoading: React.PropTypes.bool.isRequired
}

export default FileTable