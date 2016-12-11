import { combineReducers } from 'redux';

import fileReducer from './fileReducer';
import userReducer from './userReducer';
import statusReducer from './statusReducer';

const rootReducer = combineReducers({
    files: fileReducer,
    user: userReducer,
    status: statusReducer
});

export default rootReducer;
