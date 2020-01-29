import * as React from 'react'
import {Layout} from 'antd'

const {Content} = Layout

type Props = {}

const Home: React.FC<Props> = props => {
	return (
		<Layout>
			<Content>{props.children}</Content>
		</Layout>
	)
}

export default Home
