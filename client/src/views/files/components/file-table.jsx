import React from 'react'
// import ReactDOM from 'react-dom'

import FileTableRow from './file-table-row.jsx'

const FileTable = ({files}) => (
  <table>
    <tbody>
      {(files && files.length > 0)
        ? files.map(file => <FileTableRow key={file.id} file={file}/>)
        : <tr>
          <td>No files</td>
        </tr>
}
    </tbody>
  </table>
)

FileTable.propTypes = {
  files: React.PropTypes.array.isRequired
}

export default FileTable