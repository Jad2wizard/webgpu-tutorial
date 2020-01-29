import {createStore, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './rootReducer'
import rootSagas from './rootSagas'

const sagaMiddleware = createSagaMiddleware()
const middlewares = [createLogger(), sagaMiddleware]

const store = createStore(rootReducer, applyMiddleware(...middlewares))

/* eslint-disable */
if ((module as any).hot) {
	;(module as any).hot.accept('./rootReducer', () => {
		const nextRootReducer = require('./rootReducer')
		store.replaceReducer(nextRootReducer)
	})
}
/* eslint-enable */

sagaMiddleware.run(rootSagas)

export type AppState = ReturnType<typeof rootReducer>

export default store
