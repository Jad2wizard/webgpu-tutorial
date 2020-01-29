import {combineReducers} from 'redux'
import {
	User,
	REGISTER_REQUEST,
	REGISTER_RECEIVE,
	REGISTER_ERROR,
	LOGIN_REQUEST,
	LOGIN_RECEIVE,
	LOGIN_ERROR,
	LOGOUT_ERROR,
	LOGOUT_RECEIVE,
	LOGOUT_REQUEST,
	SessionAction
} from './types'

const user = (state: User = {username: ''}, action: SessionAction): User | null => {
	switch (action.type) {
		case LOGIN_RECEIVE:
			return action.user
		case LOGOUT_RECEIVE:
			return null
		default:
			return state
	}
}

const isLoading = (state = false, action: SessionAction): boolean => {
	switch (action.type) {
		case REGISTER_REQUEST:
		case LOGIN_REQUEST:
		case LOGOUT_REQUEST:
			return true
		case LOGIN_RECEIVE:
		case LOGIN_ERROR:
		case LOGOUT_RECEIVE:
		case LOGOUT_ERROR:
		case REGISTER_RECEIVE:
		case REGISTER_ERROR:
			return false
		default:
			return state
	}
}

const sessionState = combineReducers({
	isLoading,
	user
})

export default sessionState
