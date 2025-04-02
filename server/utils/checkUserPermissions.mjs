import UsersDBService from '../src/v1/models/user/UsersDBService.mjs'

const checkUserPermissions = async (userId, path) => {
	const user = await UsersDBService.getById(userId)

	if (!user || !user.type || !user.type.name) {
		console.log('Type or type.name is undefined, access denied')
		return false
	}

	const type = user.type.name

	const closedForManagerPaths = ['/dashboard/users/update/', '/dashboard/users/delete']

	if (type === 'manager' && !closedForManagerPaths.some((restrictedPath) => path.includes(restrictedPath))) {
		return true
	}
	if (type === 'admin') {
		return true
	}

	return false
}

export default checkUserPermissions
