import React from 'react'
import {formatBytes, formatDate} from '../../../utils/displayUtils'

const FileTableRow = ({file, onClick}) => (
  <tr onClick={() => onClick(file.id)}>
    <td>
      <span className="icon icon-share"></span>&nbsp; {file.shared || 0}
    </td>
    <td>{file['.tag']}</td>
    <td>{file.name}</td>
    <td>{formatBytes(file.size)}</td>
    <td>{formatDate(file.client_modified)}</td>
    <td>{formatDate(file.server_modified)}</td>
  </tr>
)

FileTableRow.propTypes = {
  file: React
    .PropTypes
    .shape({name: React.PropTypes.string, client_modified: React.PropTypes.string, server_modified: React.PropTypes.string, size: React.PropTypes.number})
    .isRequired,
  onClick: React.PropTypes.func.isRequired
}

export default FileTableRow

// client_modified : "2016-11-09T19:19:54Z" id : "id:vhS2CP8MelAAAAAAAAAAAw"
// name : "SAM_7233.JPG" path_display : "/SAM_7233.JPG" path_lower :
// "/sam_7233.jpg" rev : "15021f159" server_modified : "2016-11-09T19:19:54Z"
// size : 4856820