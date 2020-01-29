export const checkUsername = (username: string): string | null => {
	if (!username) {
		return '用户名不能为空'
	}
	return null
}

export const checkPassword = (password: string): string | null => {
	if (!password) {
		return '密码不能为空'
	}
	return null
}
