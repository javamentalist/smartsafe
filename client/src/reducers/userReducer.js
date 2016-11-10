import {SET_AUTH_STATUS} from '../actions'

const initialState = {
  isAuthenticated: false
}

function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_AUTH_STATUS:
      return Object.assign({}, state, {isAuthenticated: action.payload});
    default:
      return state
  }
}

export default userReducer
