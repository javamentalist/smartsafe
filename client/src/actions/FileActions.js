/*
 * action types
 */

export const OPEN_FILE_DIALOG = 'OPEN_FILE_DIALOG'
export const ADD_NEW_FILE = 'ADD_NEW_FILE'
export const SET_FILES = 'SET_FILES'

/*
 * other constants
 */


/*
 * action creators
 */

export function openFileDialog() {
  return { type: OPEN_FILE_DIALOG }
}

export function addNewFile(file) {
  return { type: ADD_NEW_FILE, payload: file }
}

export function setFiles(files) {
  return { type: SET_FILES, payload: files }
}