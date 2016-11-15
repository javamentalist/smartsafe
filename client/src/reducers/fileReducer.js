import { SET_FILES, SET_DETAIL, ADD_FILE_TO_UPLOAD_QUEUE, REMOVE_FILE_FROM_UPLOAD_QUEUE, START_UPLOAD, UPLOAD_FINISHED } from '../actions'
import { uploadQueueObjectStructure } from '../actions'

import path from 'path'
import _ from 'lodash'

const initialState = {
  userFiles: [],
  detailedFile: {},
  uploadQueue: []
}


function fileReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILES:
      return Object.assign({}, state, {
        userFiles: action.payload
      });
    case SET_DETAIL:
      return Object.assign({}, state, {
        detailedFile: _
          .chain(state.userFiles)
          .find({
            'id': action.payload
          })
          .defaultTo({})
          .value()
      });
    case ADD_FILE_TO_UPLOAD_QUEUE:
      return Object.assign({}, state, {
        uploadQueue: [
          ...state.uploadQueue,
          Object.assign({}, uploadQueueObjectStructure, action.payload, { // payload contains {path: /path/to/file}
            name: path.basename(action.payload.path),
            dir: path.dirname(action.payload.path)
          })
        ]
      });
    case REMOVE_FILE_FROM_UPLOAD_QUEUE:
      return Object.assign({}, state, {
        uploadQueue: state
          .uploadQueue
          .filter((item, index) => index !== action.payload)
      })
    case START_UPLOAD:
    case UPLOAD_FINISHED:
    default:
      return state
  }
}

export default fileReducer