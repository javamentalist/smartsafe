import React from 'react'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

import {formatBytes, formatDate} from '../../../utils/displayUtils'

const showCheckbox = false;
const FileTable = ({files, onRowClick}) => (
  <Table>
    <TableHeader
      displaySelectAll={showCheckbox}
      adjustForCheckbox={showCheckbox}
      enableSelectAll={false}>
      <TableRow>
        <TableHeaderColumn>Type</TableHeaderColumn>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Size</TableHeaderColumn>
        <TableHeaderColumn>Client modified</TableHeaderColumn>
        <TableHeaderColumn>Server modified</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false}>
      {(files && files.length > 0)
        ? files.map((file) => (
          <TableRow
            key={file.id}
            onMouseUp={() => {
            onRowClick(file.id);
          }}>
            {/*<TableRowColumn>
              <span className="icon icon-share"></span>&nbsp; {file.shared || 0}
            </TableRowColumn>*/}
            <TableRowColumn>{file['.tag']}</TableRowColumn>
            <TableRowColumn>{file.name}</TableRowColumn>
            <TableRowColumn>{formatBytes(file.size)}</TableRowColumn>
            <TableRowColumn>{formatDate(file.client_modified)}</TableRowColumn>
            <TableRowColumn>{formatDate(file.server_modified)}</TableRowColumn>
          </TableRow>
        ))
        : <TableRow>
          <TableRowColumn
            colSpan="6"
            style={{
            textAlign: 'center'
          }}>No files</TableRowColumn>
        </TableRow>
}
    </TableBody>
  </Table>
);

FileTable.propTypes = {
  files: React.PropTypes.array.isRequired,
  onRowClick: React.PropTypes.func.isRequired
}

export default FileTable