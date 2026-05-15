import { validationResult } from 'express-validator'
import { isValidObjectId } from 'mongoose'
import FormatValidationErrors from '../../../validators/formatValidationErrors.mjs'
import { HttpError } from '../../../errors/HttpError.mjs'

import UsersDBService from '../models/user/UsersDBService.mjs'
import TypesDBService from '../models/type/TypesDBService.mjs'
import { errorCodes } from '../../../constants/errorCodes.mjs'

class UserController {
	static async usersList(req, res, next) {
		try {
			const usersTypes = await TypesDBService.getList({})
			const data = await UsersDBService.getList({})

			res.status(200).json({
				data,
				types: usersTypes,
			})
		} catch (err) {
			next(err)
		}
	}

	static async updateUser(req, res, next) {
		try {
			const id = req.params.id

			if (!id) {
				return next(new HttpError(400, 'User ID is required', { code: errorCodes.BAD_REQUEST }))
			}

			const { typeId } = req.body

			if (!typeId) {
				return next(new HttpError(400, 'TypeId ID is required', { code: errorCodes.BAD_REQUEST }))
			}

			const data = await UsersDBService.updateUser(id, { type: typeId })

			if (!data) {
				return next(new HttpError(404, 'User not found', { code: errorCodes.NOT_FOUND }))
			}

			res.status(200).json({
				message: 'User updated successfully',
				data,
			})
		} catch (err) {
			next(err)
		}
	}

	static async deleteUser(req, res, next) {
		try {
			const id = req.params?.id

			if (!id) {
				return next(
					new HttpError(400, 'Param id is required', {
						code: errorCodes.BAD_REQUEST,
					})
				)
			}

			if (!isValidObjectId(id)) {
				return next(new HttpError(400, 'Invalid user id', { code: errorCodes.BAD_REQUEST }))
			}

			const deleted = await UsersDBService.deleteById(id)

			if (!deleted) {
				return next(new HttpError(404, 'User not found', { code: errorCodes.NOT_FOUND }))
			}

			res.status(204).json({ success: true })
		} catch (err) {
			next(err)
		}
	}
}

export default UserController
