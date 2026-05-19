import RefreshToken from './RefreshToken.mjs'

class RefreshTokenDBService {
	static async create(data) {
		return RefreshToken.create(data)
	}

	static async findValidByHash(tokenHash) {
		return RefreshToken.findOne({
			tokenHash,
			revokedAt: null,
			expiresAt: { $gt: new Date() },
		})
	}

	static async findByHash(tokenHash) {
		return RefreshToken.findOne({ tokenHash })
	}

	static async revokeById(id) {
		return RefreshToken.findByIdAndUpdate(id, { revokedAt: new Date() })
	}

	static async revokeByHash(tokenHash) {
		return RefreshToken.findOneAndUpdate({ tokenHash }, { revokedAt: new Date() })
	}

	static async revokeAllForUser(userId) {
		return RefreshToken.updateMany({ userId, revokedAt: null }, { revokedAt: new Date() })
	}
}

export default RefreshTokenDBService
