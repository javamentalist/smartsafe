import React, { PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import CloudDownload from 'material-ui/svg-icons/file/cloud-download';
import { lightBlue500, amber500, lightGreen300, green700, red300, red700, grey100, grey300 } from 'material-ui/styles/colors';

import { formatBytes, formatDate } from '../../../utils/displayUtils';
import { isFileEncrypted, removeExtension } from '../../../utils/fileUtils';

const style = {
    table: {
        tableLayout: 'auto'
    },
    statusCol: {
        width: '75px',
        minWidth: '75px',
        padding: 0,
        textAlign: 'center'
    },
    statusIcon: {
        paddingLeft: '15px'
    },
    nameCol: {

    },
    sizeCol: {
        width: '10%',
        maxWidth: '100px'
    },
    modCol: {
        width: '20%',
        maxWidth: '200px'
    },
    actionsCol: {
        width: '125px',
        padding: 0
    }
};

const propTypes = {
    files: PropTypes.array.isRequired,
    onRowClick: PropTypes.func.isRequired,
    onFileDelete: PropTypes.func.isRequired,
    onFileDownload: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired
};

class FileTable extends React.Component {
    renderStatusIcon(file) {
        if (!file.status || file.status == 'unprotected') {
            return (
                // <IconButton>
                <FontIcon className="fa fa-chain-broken" style={ style.statusIcon } />
                // </IconButton>
                );
        } else if (file.status == 'protected') {
            return (
                // <IconButton>
                <FontIcon className="fa fa-chain" color={ green700 } style={ style.statusIcon } />
                // </IconButton>
                );
        } else if (file.status == 'faulty') {
            return (
                // <IconButton>
                <FontIcon className="fa fa-warning" color={ red700 } style={ style.statusIcon } />
                // </IconButton>
                );
        }
    }

    render() {
        let files = this.props.files;
        let onRowClick = this.props.onRowClick;
        let onFileDelete = this.props.onFileDelete;
        let onFileDownload = this.props.onFileDownload;
        let isLoading = this.props.isLoading;

        const showCheckbox = false;

        return (
            <Table style={ style.table }>
              <TableHeader displaySelectAll={ showCheckbox } adjustForCheckbox={ showCheckbox } enableSelectAll={ false }>
                <TableRow>
                  <TableHeaderColumn style={ style.statusCol }>Status</TableHeaderColumn>
                  <TableHeaderColumn style={ style.nameCol }>Name</TableHeaderColumn>
                  <TableHeaderColumn style={ style.sizeCol }>Size</TableHeaderColumn>
                  <TableHeaderColumn style={ style.modCol }>Client modified</TableHeaderColumn>
                  <TableHeaderColumn style={ style.modCol }>Server modified</TableHeaderColumn>
                  <TableHeaderColumn style={ style.actionsCol }></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={ false }>
                { /*onMouseUp={ () => onRowClick(file.id) }*/ }
                { (files && files.length > 0) &&
                  files.map((file) => {
                      file.isEncrypted = isFileEncrypted(file.name);

                      return (
                          <TableRow key={ file.id } selectable={ false } style={ { backgroundColor: (file.status == 'protected') ? lightGreen300 : ((file.status == 'faulty') ? red300 : grey100) } }>
                            <TableRowColumn style={ style.statusCol }>
                              { this.renderStatusIcon(file) }
                              <FontIcon className="fa fa-key" style={ style.statusIcon } color={ file.isEncrypted ? amber500 : grey300 } />
                            </TableRowColumn>
                            <TableRowColumn style={ style.nameCol }>
                              { file.isEncrypted ? removeExtension(file.name, '.enc') : file.name }
                            </TableRowColumn>
                            <TableRowColumn style={ style.sizeCol }>
                              { formatBytes(file.size) }
                            </TableRowColumn>
                            <TableRowColumn style={ style.modCol }>
                              { formatDate(file.client_modified) }
                            </TableRowColumn>
                            <TableRowColumn style={ style.modCol }>
                              { formatDate(file.server_modified) }
                            </TableRowColumn>
                            <TableRowColumn style={ style.actionsCol }>
                              <IconButton onClick={ () => onFileDelete(file) }>
                                <Delete color={ red700 } />
                              </IconButton>
                              <IconButton onClick={ () => onFileDownload(file) }>
                                <CloudDownload color={ lightBlue500 } />
                              </IconButton>
                            </TableRowColumn>
                          </TableRow>
                      );
                  }) }
                { isLoading &&
                  <TableRow>
                    <TableRowColumn colSpan="6" style={ { textAlign: 'center' } }>Loading</TableRowColumn>
                  </TableRow> }
                { !isLoading && (!files || files.length <= 0) &&
                  <TableRow>
                    <TableRowColumn colSpan="6" style={ { textAlign: 'center' } }>No files</TableRowColumn>
                  </TableRow> }
              </TableBody>
            </Table>
            );
    }
}

FileTable.propTypes = propTypes;

export default FileTable;