import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Route} from 'react-router-dom'
import {Provider} from 'react-redux'
import {BrowserRouter as Router} from 'connect-redux-react-router'
import store from './Store'
import Login from './Pages/Session/Login'
import Layout from './Pages/Layout'
import styles from './index.less'

/* eslint-disable */
if ((module as any).hot) {
	;(module as any).hot.accept()
}
/* eslint-enable */

const App: React.FC<{}> = () => {
	return (
		<Layout>
			<div>
				<Router store={store}>
					<Route path="/login">
						<Login />
					</Route>
				</Router>
			</div>
		</Layout>
	)
}

ReactDOM.render(<App />, document.querySelector('#main'))
