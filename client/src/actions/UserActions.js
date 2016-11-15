
/*
 * action types
 */

export const SET_AUTH_STATUS = 'SET_AUTH_STATUS'

/*
 * other constants
 */


/*
 * action creators
 */

export function setAuthStatus(isAuthenticated) {
  return {
    type: SET_AUTH_STATUS,
    payload: isAuthenticated
  }
}
