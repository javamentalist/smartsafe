import React from 'react'


const FileTableRow = ({file}) => (
  <tr>
    <td>
      <span className="icon icon-share"></span>&nbsp;
          {file.shared || 0}
    </td>
    <td>{file.name}</td>
  </tr>
)

FileTableRow.propTypes = {
  file: React.PropTypes.object.isRequired
}

export default FileTableRow