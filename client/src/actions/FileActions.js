/*
 * action types
 */
export const SET_LOADING_STATUS = 'SET_LOADING_STATUS';
export const SET_FILES = 'SET_FILES';
export const SET_DETAIL = 'SET_DETAIL';
export const ADD_FILE_TO_UPLOAD_QUEUE = 'ADD_FILE_TO_UPLOAD_QUEUE';
export const REMOVE_FILE_FROM_UPLOAD_QUEUE = 'REMOVE_FILE_FROM_UPLOAD_QUEUE';
export const START_UPLOAD = 'START_UPLOAD';
export const UPLOAD_FINISHED = 'UPLOAD_FINISHED';
export const SET_FILE_PROTECTION_STATUS = 'SET_FILE_PROTECTION_STATUS';
export const SET_FILE_LOCAL_UNENCRYPTED_PATH = 'SET_FILE_LOCAL_UNENCRYPTED_PATH';

/*
 * other constants
 */
export const uploadQueueObjectStructure = {
  path: '',
  name: '',
  dir: '',
  progress: 0,
  isComplete: false,
  isUploadInProgress: false
};

/*
 * action creators
 */
export function setLoadingStatus(newStatus) {
  return {
    type: SET_LOADING_STATUS,
    payload: newStatus
  }
}
export function setFiles(files) {
  return {
    type: SET_FILES,
    payload: files
  }
}

export function setDetail(fileId) {
  return {
    type: SET_DETAIL,
    payload: fileId
  }
}

export function addFileToUploadQueue(file) {
  return {
    type: ADD_FILE_TO_UPLOAD_QUEUE,
    payload: file
  }
}

export function removeFileFromUploadQueue(file) {
  return {
    type: REMOVE_FILE_FROM_UPLOAD_QUEUE,
    payload: file
  }
}

export function setStartUpload(file) {
  return {
    type: START_UPLOAD,
    payload: file
  }
}

export function setUploadFinished(file) {
  return {
    type: UPLOAD_FINISHED,
    payload: file
  }
}

export function setFileProtectionStatus(file, status) {
  return {
    type: SET_FILE_PROTECTION_STATUS,
    payload: { file: file, status: status }
  }
}

export function setFileLocalUnencryptedPath(file, path) {
  return {
    type: SET_FILE_LOCAL_UNENCRYPTED_PATH,
    payload: { file: file, path:path }
  }
}