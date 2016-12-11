
/*
 * action types
 */
export const SET_STATUS_TEXT = 'SET_STATUS_TEXT';
export const SET_STORAGE_STATUS = 'SET_STORAGE_STATUS';
export const SET_ETHEREUM_STATUS = 'SET_ETHEREUM_STATUS';

/*
 * other constants
 */
export const statusLevel = {
    OK: 'OK',
    WARNING: 'WARNING',
    ERROR: 'ERROR'
}

/*
 * action creators
 */
export function setStorageStatus(status, description) {
    return {
        type: SET_STORAGE_STATUS,
        payload: {
            status: status,
            description: description
        }
    }
}

export function setEthereumStatus(status, description) {
    return {
        type: SET_ETHEREUM_STATUS,
        payload: {
            status: status,
            description: description
        }
    }
}

export function setStatusText(text) {
    return {
        type: SET_STATUS_TEXT,
        payload: text
    }
}
