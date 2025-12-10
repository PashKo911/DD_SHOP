import TypesDBService from '../models/type/TypesDBService.mjs'

class TypesController {
	static async getTypes(req, res, next) {
		try {
			const data = await TypesDBService.getList({})

			res.status(200).json({
				success: true,
				data,
			})
		} catch (error) {
			next(error)
		}
	}
}

export default TypesController
