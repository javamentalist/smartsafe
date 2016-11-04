import React from 'react'
import ReactDOM from 'react-dom'

import FileTableRow from './file-table-row.jsx'

export default class FileTable extends React.Component {

  getTableRows() {
    return this
      .props
      .files
      .map(file => <FileTableRow key={file.id} file={file} />);
  }

  render() {
    return (
      <table>
        <tbody>
          {this.props.files &&
            this.props.files.length > 0 &&
            this.getTableRows()
          }
        </tbody>
      </table>
    );
  }
}
