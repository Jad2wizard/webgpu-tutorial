import {all, take, call, put, fork, delay} from 'redux-saga/effects'
import {SagaIterator, Saga} from 'redux-saga'
import * as actions from './actions'
import {message} from 'antd'
import fetchProxy from './../../../utils/fetchProxy'
import {RequestUser, LOGIN_REQUEST, REGISTER_REQUEST, LOGOUT_REQUEST} from './types'

const loginUrl = `/login`
const logoutUrl = `/logout`
const registerUrl = `/register`

function* login({username, password}: RequestUser): SagaIterator {
	try {
		yield delay(500)

		let result = yield call(fetchProxy, loginUrl, {
			method: 'POST',
			contentType: 'application/json',
			payload: {username, password}
		})
		yield put(actions.login({status: 'receive', user: result}))

		//登录成功后控制页面跳转至登录前的页面
		let nextUrl = location.href.split('nextUrl=')[1] || null
		nextUrl = nextUrl ? decodeURIComponent(nextUrl) : '/'
		if (nextUrl.startsWith('/api/')) {
			//如果登录前访问的是/api接口，则直接将页面url跳转至该接口，因为前端路由中不含有/api接口，会跳转至404页面
			window.location.href = location.origin + nextUrl
		} else {
			// yield put(routerActions.push(nextUrl))
		}
	} catch (err) {
		message.error(err.toString())
		yield put(actions.login({status: 'error', error: err.toString()}))
	}
}

function* logout(): SagaIterator {
	try {
		yield call(fetchProxy, logoutUrl)
		yield put(actions.logout({status: 'receive'}))
		// yield put(routerActions.push('/login'))
	} catch (err) {
		message.error(err.toString())
		yield put(actions.logout({status: 'error', error: err.toString()}))
	}
}

function* register({username, password}: RequestUser): SagaIterator {
	try {
		let result = yield call(fetchProxy, registerUrl, {
			method: 'POST',
			contentType: 'application/json',
			payload: {name: username, password}
		})
		message.success(result.message)
		// yield put(routerActions.push('/login'))
	} catch (err) {
		message.error(err)
	}
}

function* watchLogin(): SagaIterator {
	while (true) {
		const {username, password} = yield take(LOGIN_REQUEST)
		yield fork(login, {username, password})
	}
}

function* watchLogout(): SagaIterator {
	while (true) {
		yield take(LOGOUT_REQUEST)
		yield fork(logout)
	}
}

function* watchRegister(): SagaIterator {
	while (true) {
		const {username, password} = yield take(REGISTER_REQUEST)
		yield fork(register, {username, password})
	}
}

export default function* sessionSaga(): SagaIterator {
	yield all([call(watchLogin), call(watchLogout), call(watchRegister)])
}
