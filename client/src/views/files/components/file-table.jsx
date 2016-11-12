import React from 'react'
// import ReactDOM from 'react-dom'

import FileTableRow from './file-table-row.jsx'

const FileTable = ({files, onRowClick}) => (
  <table>
    <tbody>
      {(files && files.length > 0)
        ? files.map(file => <FileTableRow key={file.id} file={file} onClick={onRowClick}/>)
        : <tr>
          <td>No files</td>
        </tr>
}
    </tbody>
  </table>
)

FileTable.propTypes = {
  files: React.PropTypes.array.isRequired,
  onRowClick: React.PropTypes.func.isRequired
}

export default FileTable