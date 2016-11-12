import {ADD_NEW_FILE, SET_FILES, SET_DETAIL} from '../actions'

import _ from 'lodash'

const initialState = {
  userFiles: [],
  detailedFile: {}
}

function fileReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_NEW_FILE:
      return Object.assign({}, state, {
        userFiles: [
          ...state.userFiles,
          action.payload // payload contains new file
        ]
      });
    case SET_FILES:
      return Object.assign({}, state, {userFiles: action.payload});
    case SET_DETAIL:
      return Object.assign({}, state, {
        detailedFile: _
          .chain(state.userFiles)
          .find({'id': action.payload})
          .defaultTo({})
          .value()
      });
    default:
      return state
  }
}

export default fileReducer