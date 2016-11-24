import React from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui/svg-icons/content/clear';
import CloudUpload from 'material-ui/svg-icons/file/cloud-upload';
import Done from 'material-ui/svg-icons/action/done';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { lightBlue500, green500, red500 } from 'material-ui/styles/colors';

import _ from 'lodash';

const style = {
    table: {
        tableLayout: 'auto',
        boxSizing: 'border-box'
    },
    progressCol: {
        width: '50%',
        minWidth: '200px',
        maxWidth: '500px'
    },
    actionsCol: {
        width: '100px',
        padding: 0,
        position: 'relative',
        margin: 0
    },
    refresh: {
        position: 'relative',
        display: 'inline-block',
        margin: '12px'
    }
};


//const UploadQueue = ({files}) => (
class UploadQueue extends React.Component {

    renderRow(index, file) {
        return (
            <TableRow key={ file.name } selectable={ false }>
              <TableRowColumn>
                { file.name }
                <br/>
                <small>{ file.dir }</small>
              </TableRowColumn>
              <TableRowColumn style={ style.progressCol }>
                <LinearProgress mode={ file.isUploadInProgress ? ((!file.progress || file.progress === 0) ? "indeterminate" : "determinate") : "determinate" } value={ file.progress } color={ file.isComplete ? green500 : '' } />
              </TableRowColumn>
              <TableRowColumn style={ style.actionsCol }>
                { !file.isComplete &&
                  <IconButton onClick={ () => this.props.onFileRemove(file) } disabled={ file.isUploadInProgress }>
                    <Clear/>
                  </IconButton> }
                { !(file.isUploadInProgress || file.isComplete) &&
                  <IconButton onClick={ () => this.props.onFileUpload(file) }>
                    <CloudUpload color={ lightBlue500 } />
                  </IconButton> }
                { file.isUploadInProgress &&
                  <RefreshIndicator size={ 24 } left={ 0 } top={ 0 } status="loading" style={ style.refresh } /> }
                { file.isComplete &&
                  <IconButton onClick={ () => this.props.onFileRemove(file) }>
                    <Done color={ green500 } />
                  </IconButton> }
              </TableRowColumn>
            </TableRow>
            );
    }

    render() {
        const files = this.props.files;
        const showCheckbox = false;

        // if (files && files.length > 0) {
        return (
            <div>
              <h3>Upload queue</h3>
              { (files && files.length > 0)
                ? <Table style={ style.table }>
                    <TableHeader displaySelectAll={ showCheckbox } adjustForCheckbox={ showCheckbox }>
                      <TableRow>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn style={ style.progressCol }>Progress</TableHeaderColumn>
                        <TableHeaderColumn style={ style.actionsCol }></TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={ showCheckbox }>
                      { (files && files.length > 0) && files.map((file, index) => (this.renderRow(index, file))) }
                    </TableBody>
                  </Table>
                : <p>Queue is empty</p> }
            </div>
            );
    }
}

UploadQueue.propTypes = {
    files: React.PropTypes.arrayOf(React.PropTypes.shape({
        path: React.PropTypes.string.isRequired,
        progress: function(props, propName, componentName) {
            const value = props[propName];
            if (!_.isUndefined(value) && !_.isNumber(value)) {
                return new Error(`Invalid prop '${propName}' supplied to '${componentName}' (${value}). Should be number. Validation failed.`);
            }
            if (value < 0 || value > 100) {
                return new Error('Invalid prop `' + propName + '` supplied to `' + componentName + '`. Should be between 0 and 100 (inclusive). Validation failed.');
            }
        }
    })).isRequired,
    onFileRemove: React.PropTypes.func.isRequired,
    onFileUpload: React.PropTypes.func.isRequired
};

export default UploadQueue;