export function canAccessRoute(route, user) {
	const roles = route.meta?.roles
	if (!roles) return true
	return roles.includes(user?.role)
}
