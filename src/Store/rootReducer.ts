import {combineReducers} from 'redux'
import sessionReducer from './../Pages/Session/models/reducer'

export default combineReducers({
	sessionState: sessionReducer
})
