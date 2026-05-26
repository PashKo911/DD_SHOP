export function serializeUserForClient(user) {
	if (!user) return null

	const plainUser = typeof user.toObject === 'function' ? user.toObject() : user
	const { _id, name, email, avatar, type, role, googleId, createdAt, updatedAt } = plainUser

	return {
		_id,
		name,
		email,
		avatar: avatar ?? null,
		type: type ?? role ?? null,
		googleId: googleId ?? null,
		createdAt: createdAt ?? null,
		updatedAt: updatedAt ?? null,
	}
}

export function buildAccessTokenPayload(user) {
	if (!user) return null

	const plainUser = typeof user.toObject === 'function' ? user.toObject() : user
	const { _id, email, name, type, role } = plainUser

	return {
		_id,
		email,
		name,
		type: type ?? role ?? null,
	}
}
