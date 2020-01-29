import {all, call} from 'redux-saga/effects'
import {SagaIterator, Saga} from 'redux-saga'
import sessionSaga from './../Pages/Session/models/sagas'

export default function*(): SagaIterator {
	yield all([call(sessionSaga)])
}
