import { SET_STATUS_TEXT, SET_STORAGE_STATUS, SET_ETHEREUM_STATUS } from '../actions'
import { statusLevel } from '../actions';

const initialState = {
    storage: {
        location: 'Dropbox',
        status: statusLevel.ERROR,
        description: 'Not connected'
    },
    ethereum: {
        status: statusLevel.ERROR,
        description: 'Not connected'
    },
    message: 'Starting up...'
};

function statusReducer(state = initialState, action) {
    switch (action.type) {
        case SET_STATUS_TEXT:
            return Object.assign({}, state, {
                message: action.payload
            });
        case SET_STORAGE_STATUS:
            return Object.assign({}, state, {
                storage: Object.assign({}, state.storage, {
                    status: action.payload.status,
                    description: action.payload.description
                })
            });
        case SET_ETHEREUM_STATUS:
            return Object.assign({}, state, {
                ethereum: Object.assign({}, state.ethereum, {
                    status: action.payload.status,
                    description: action.payload.description
                })
            });
        default:
            return state
    }
}

export default statusReducer
