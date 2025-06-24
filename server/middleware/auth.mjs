import { parseBearer } from '../utils/jwtHelpers.mjs'

export const authMiddleware = (req, res, next) => {
	try {
		const user = parseBearer(req.headers.authorization, req.headers)
		req.user = user
		next()
	} catch (err) {
		res.status(401).json({ result: 'Access Denied' })
	}
}

export function checkAdmin(req, res, next) {
	if (!req.user || req.user.role.name !== 'admin') {
		return res.status(403).json({ message: 'Forbidden: Admins only' })
	}
	next()
}
