import * as React from 'react'
import * as enzyme from 'enzyme'
import Hello from './Hello'
import styles from './Hello.less'

it('Test render', () => {
	const hello = enzyme.shallow(<Hello name="jad" enthusiasmLevel={2} />)
	console.log('running...')
	console.log(styles)
	expect(hello.find('.' + styles.greeting).text()).toEqual('Hello jad!')
})
