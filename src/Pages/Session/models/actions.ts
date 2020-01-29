import {
	REGISTER_REQUEST,
	REGISTER_RECEIVE,
	REGISTER_ERROR,
	LOGIN_REQUEST,
	LOGIN_RECEIVE,
	LOGIN_ERROR,
	LOGOUT_ERROR,
	LOGOUT_RECEIVE,
	LOGOUT_REQUEST,
	RegisterAction,
	RegisterActionParam,
	LoginAction,
	LoginActionParam,
	LogoutAction,
	LogoutActionParam
} from './types'

export const register = (params: RegisterActionParam): RegisterAction => {
	switch (params.status) {
		case 'request':
			return {
				type: REGISTER_REQUEST,
				username: params.username,
				password: params.password
			}
		case 'receive':
			return {
				type: REGISTER_RECEIVE,
				user: params.user
			}
		default:
			return {
				type: REGISTER_ERROR,
				error: params.error
			}
	}
}

export const login = (params: LoginActionParam): LoginAction => {
	switch (params.status) {
		case 'request':
			return {
				type: LOGIN_REQUEST,
				username: params.username,
				password: params.password
			}
		case 'receive':
			return {
				type: LOGIN_RECEIVE,
				user: params.user
			}
		case 'error':
			return {
				type: LOGIN_ERROR,
				error: params.error
			}
	}
}

export const logout = (params: LogoutActionParam): LogoutAction => {
	switch (params.status) {
		case 'request':
			return {
				type: LOGOUT_REQUEST
			}
		case 'receive':
			return {
				type: LOGOUT_RECEIVE
			}
		case 'error':
			return {
				type: LOGOUT_ERROR,
				error: params.error
			}
	}
}
