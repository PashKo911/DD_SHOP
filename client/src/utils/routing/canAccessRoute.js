export function canAccessRoute(route, userRole) {
	const roles = route.meta?.roles
	if (!roles) return true
	return roles.includes(userRole)
}
