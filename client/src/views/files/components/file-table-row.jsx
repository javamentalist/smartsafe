import React from 'react'
import ReactDOM from 'react-dom'


const FileTableRow = ({file}) => (
  <tr>
    <td>
      <span className="icon icon-share"></span>&nbsp;
          {file.shared || 0}
    </td>
    <td>{file.name}</td>
  </tr>
)

export default FileTableRow