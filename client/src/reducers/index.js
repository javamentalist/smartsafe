import { combineReducers } from 'redux'
import { OPEN_FILE_DIALOG, ADD_NEW_FILE, SET_FILES } from '../actions'

// import { remote } from 'electron'

import winston from 'winston'

const initialState = {
  myFiles: []
}

function fileReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_NEW_FILE:
      let newState = state
      newState.files = [
        ...state,
        action.payload// payload contains new file
      ]
      return newState
    case SET_FILES:
      let newState2 = state
      newState2.files = action.payload
      return newState2
    default:
      return state
  }
}

const rootReducer = combineReducers({ files: fileReducer })

export default rootReducer