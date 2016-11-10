import {combineReducers} from 'redux'

import fileReducer from './fileReducer'
import userReducer from './userReducer'


const rootReducer = combineReducers({files: fileReducer, user: userReducer})

export default rootReducer