import { SET_LOADING_STATUS, SET_FILES, SET_DETAIL, ADD_FILE_TO_UPLOAD_QUEUE, REMOVE_FILE_FROM_UPLOAD_QUEUE, START_UPLOAD, UPLOAD_FINISHED, SET_FILE_STATUS, SET_FILE_LOCAL_UNENCRYPTED_PATH } from '../actions'
import { uploadQueueObjectStructure } from '../actions'

import path from 'path'
import _ from 'lodash'

const initialState = {
    isLoading: false,
    userFiles: [],
    detailedFile: {},
    uploadQueue: []
}

function findFileById(files, id) {
    return _
        .chain(files)
        .find({
            'id': id
        })
        .defaultTo({})
        .value();
}

function updateMatchingItems(items, file, newValues) {
    return items.map((item) => {
        if (item.name !== file.name) {
            // This isn't the item we care about - keep it as-is
            return item;
        }

        // Otherwise, this is the one we want - return an updated value
        return Object.assign({}, item, newValues);
    });
}


function fileReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LOADING_STATUS:
            return Object.assign({}, state, {
                isLoading: action.payload
            });
        case SET_FILES:
            return Object.assign({}, state, {
                userFiles: action.payload
            });
        case SET_DETAIL:
            return Object.assign({}, state, {
                detailedFile: findFileById(state.userFiles, action.payload)
            });
        case ADD_FILE_TO_UPLOAD_QUEUE:
        	var fileName = path.basename(action.payload.path);
        	var hasFileWithTheSameName = state
        			.userFiles
        			.filter((item) => item.name === fileName.concat('.enc'))
        			.length != 0;
        	if (hasFileWithTheSameName) {
        		alert('You tried to upload file with name ' + fileName + ', but it already exists on your Dropbox.\r\n' +
        				'Choose another file to upload or rename it before attempting again.');
        		return Object.assign({}, state, {});
        	}
        	
        	return Object.assign({}, state, {
                uploadQueue: [
                    ...state.uploadQueue,
                    Object.assign({}, uploadQueueObjectStructure, action.payload, { // payload contains {path: /path/to/file}
                        name: path.basename(action.payload.path),
                        dir: path.dirname(action.payload.path)
                    })
                ]
            });
        case REMOVE_FILE_FROM_UPLOAD_QUEUE:
            return Object.assign({}, state, {
                uploadQueue: state
                    .uploadQueue
                    .filter((item) => item.name !== action.payload.name)
            });
        case START_UPLOAD:
            return Object.assign({}, state, {
                uploadQueue: updateMatchingItems(state.uploadQueue, action.payload, {
                    isUploadInProgress: true
                })
            });
        case UPLOAD_FINISHED:
            return Object.assign({}, state, {
                uploadQueue: updateMatchingItems(state.uploadQueue, action.payload, {
                    isUploadInProgress: false,
                    isComplete: true,
                    progress: 100
                })
            });
        case SET_FILE_STATUS:
            return Object.assign({}, state, {
                userFiles: updateMatchingItems(state.userFiles, action.payload.file, {
                    status: action.payload.status,
                    ethInfo: action.payload.status === 'protected' ?
                        {
                            hash: action.payload.file.hash,
                            link: action.payload.file.link
                        }
                        : null
                })
            });
        case SET_FILE_LOCAL_UNENCRYPTED_PATH:
            return Object.assign({}, state, {
                userFiles: updateMatchingItems(state.userFiles, action.payload.file, {
                    localUnEncPath: action.payload.path
                })
            });
        default:
            return state
    }
}

export default fileReducer