import React from 'react'
import ReactDOM from 'react-dom'

import FileTableRow from './file-table-row.jsx'


const FileTable = ({files}) => (
  <table>
    <tbody>
      {files &&
        files.length > 0 &&
        files.map(file =>
          <FileTableRow key={file.id} file={file} />
        )
      }
    </tbody>
  </table>
)

export default FileTable