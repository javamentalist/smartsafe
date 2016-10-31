import React from 'react'
import ReactDOM from 'react-dom'

class FileTableRow extends React.Component {

  render() {
    const item = this.props.item
    return (
      <tr>
        <td>
          <span className="icon icon-share"></span>&nbsp;
          {item.shared || 0}
        </td>
        <td>{item.name}</td>
      </tr>
    );
  }
}

export default FileTableRow