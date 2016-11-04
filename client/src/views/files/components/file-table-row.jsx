import React from 'react'
import ReactDOM from 'react-dom'

export default class FileTableRow extends React.Component {

  render() {
    const file = this.props.file
    return (
      <tr>
        <td>
          <span className="icon icon-share"></span>&nbsp;
          {file.shared || 0}
        </td>
        <td>{file.name}</td>
      </tr>
    );
  }
}
