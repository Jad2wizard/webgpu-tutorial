// import {routerActions} from 'react-router-redux'
import store from '../store'

interface Param {
	method?: string
	contentType?: string
	payload?: {
		[k: string]: string
	}
}

const doFetch = (url: string, param: Param = {}): Promise<any> => {
	let method = param.method || 'get'
	let headers = {
		'Cache-Control': 'no-cache',
		Pragma: 'no-cache'
	}

	if (method.toLowerCase() === 'get') {
		return fetch(url, {headers, credentials: 'include'}).catch(err => {
			console.warn(err)
		})
	} else {
		let payload = param.payload || {}
		let contentType = param.contentType || null
		if (!contentType) {
			let params = new FormData()
			for (let key in payload) {
				if (payload[key]) params.append(`${key}`, payload[key])
			}
			return fetch(url, {
				method: 'post',
				credentials: 'include',
				body: params
			})
		}

		return fetch(url, {
			method: method,
			headers: {
				'Content-Type': contentType
			},
			credentials: 'include',
			body: JSON.stringify(payload)
		})
	}
}

const fetchProxy = async (url: string, param?: Param): Promise<string> => {
	try {
		const res = await doFetch(url, param)

		if (res.redirected) {
			// store.dispatch(routerActions.push('/login' + res.url.split('/login')[1]))
			return ''
		}

		const data = await res.json()
		if (!res.ok) throw data.message
		return data
	} catch (e) {
		throw e.toString()
	}
}

export default fetchProxy
