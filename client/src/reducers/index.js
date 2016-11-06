import {combineReducers} from 'redux'
import {OPEN_FILE_DIALOG, ADD_NEW_FILE, SET_FILES} from '../actions'

// import { remote } from 'electron'

import winston from 'winston'

const initialState = {
  myFiles: []
}

function fileReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_NEW_FILE:
      return Object.assign({}, state, {
        myFiles: [
          ...state.myFiles,
          action.payload // payload contains new file
        ]
      })
    case SET_FILES:
      return Object.assign({}, state, {myFiles: action.payload})
    default:
      return state
  }
}

// temporarily export reducer too for testing when it's moved to its own file,
// named export is not needed anymore
export {fileReducer}

const rootReducer = combineReducers({files: fileReducer})

export default rootReducer