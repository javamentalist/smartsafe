import {ADD_NEW_FILE, SET_FILES} from '../actions'

const initialState = {
  userFiles: []
}

function fileReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_NEW_FILE:
      return Object.assign({}, state, {
        userFiles: [
          ...state.userFiles,
          action.payload // payload contains new file
        ]
      })
    case SET_FILES:
      return Object.assign({}, state, {userFiles: action.payload})
    default:
      return state
  }
}

export default fileReducer