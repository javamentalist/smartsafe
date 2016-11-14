/*
 * action types
 */

export const SET_FILES = 'SET_FILES'
export const SET_DETAIL = 'SET_DETAIL'
export const ADD_FILE_TO_UPLOAD_QUEUE = 'ADD_FILE_TO_UPLOAD_QUEUE'
export const REMOVE_FILE_FROM_UPLOAD_QUEUE = 'REMOVE_FILE_FROM_UPLOAD_QUEUE'

/*
 * other constants
 */

/*
 * action creators
 */

export function setFiles(files) {
  return {type: SET_FILES, payload: files}
}

export function setDetail(fileId) {
  return {type: SET_DETAIL, payload: fileId}
}

export function addFileToUploadQueue(file) {
  return {type: ADD_FILE_TO_UPLOAD_QUEUE, payload: file}
}

export function removeFileFromUploadQueue(index) {
  return {type: REMOVE_FILE_FROM_UPLOAD_QUEUE, payload: index}
}