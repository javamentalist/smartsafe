/*
 * action types
 */

export const ADD_NEW_FILE = 'ADD_NEW_FILE'
export const SET_FILES = 'SET_FILES'
export const SET_DETAIL = 'SET_DETAIL'

/*
 * other constants
 */

/*
 * action creators
 */

export function addNewFile(file) {
  return {type: ADD_NEW_FILE, payload: file}
}

export function setFiles(files) {
  return {type: SET_FILES, payload: files}
}

export function setDetail(fileId) {
  return {type: SET_DETAIL, payload: fileId}
}