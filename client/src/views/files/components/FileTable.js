import React from 'react'
import ReactDOM from 'react-dom'

import FileTableRow from './FileTableRow'

class FileTable extends React.Component {

  getTableRows() {
    return this
      .props
      .items
      .map(item => <FileTableRow key={item.id} item={item}/>);
  }

  render() {
    return (
      <table>
        <tbody>
          {this.getTableRows()}
        </tbody>
      </table>
    );
  }
}

export default FileTable