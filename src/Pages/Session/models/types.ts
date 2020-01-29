import {ErrorAction} from '../../../Store/types'

export const LOGIN_REQUEST = '发起登录请求'
export const LOGIN_RECEIVE = '登录成功'
export const LOGIN_ERROR = '登录失败'
export const REGISTER_REQUEST = '发起注册请求'
export const REGISTER_RECEIVE = '注册成功'
export const REGISTER_ERROR = '注册失败'
export const LOGOUT_REQUEST = '发起注销请求'
export const LOGOUT_RECEIVE = '注销成功'
export const LOGOUT_ERROR = '注销失败'

export interface User {
	username: string
}

interface RequestAction {
	username: string
	password: string
}

export type RequestUser = RequestAction

interface ReceiveAction {
	user: User
}

export interface LoginRequestAction extends RequestAction {
	type: typeof LOGIN_REQUEST
}

export interface LoginReceiveAction extends ReceiveAction {
	type: typeof LOGIN_RECEIVE
}

export interface LoginErrorAction extends ErrorAction {
	type: typeof LOGIN_ERROR
}

export type LoginAction = LoginRequestAction | LoginReceiveAction | LoginErrorAction

export type LoginActionParam = RegisterActionParam

export interface RegisterRequestAction extends RequestAction {
	type: typeof REGISTER_REQUEST
}

export interface RegisterReceiveAction extends ReceiveAction {
	type: typeof REGISTER_RECEIVE
}

export interface RegisterErrorAction extends ErrorAction {
	type: typeof REGISTER_ERROR
}

export type RegisterAction = RegisterRequestAction | RegisterReceiveAction | RegisterErrorAction

export type RegisterActionParam =
	| {
			status: 'request'
			username: string
			password: string
	  }
	| {
			status: 'receive'
			user: User
	  }
	| {
			status: 'error'
			error: string
	  }

export type LogoutAction =
	| {type: typeof LOGOUT_REQUEST}
	| {type: typeof LOGOUT_RECEIVE}
	| {type: typeof LOGOUT_ERROR; error: string}

export type LogoutActionParam = {status: 'request' | 'receive'} | {status: 'error'; error: string}

export type SessionAction = RegisterAction | LoginAction | LogoutAction
