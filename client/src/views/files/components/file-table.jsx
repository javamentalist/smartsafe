import React from 'react'
import ReactDOM from 'react-dom'

import FileTableRow from './file-table-row.jsx'

export default class FileTable extends React.Component {

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
