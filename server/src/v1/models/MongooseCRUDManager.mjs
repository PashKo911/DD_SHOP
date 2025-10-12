import FiltersHelper from '../../../utils/searchHelpers/FiltersHelper.mjs'
import { HttpError } from '../../../errors/HttpError.mjs'
import { errorCodes } from '../../../constants/errorCodes.mjs'

class MongooseCRUDManager {
	constructor(model) {
		this.model = model
	}

	async findOneWithSearchOptionsFromQuery(
		reqQuery,
		fieldsConfiguration,
		projection = null,
		populateFields = []
	) {
		try {
			let query = this.model.findOne({}, projection)

			query = FiltersHelper.applyFindOptionsFromQuery(reqQuery, fieldsConfiguration)

			this.addPopulationOptions(query, populateFields)

			const document = await query.exec()
			return document
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err && (err.name === 'CastError' || err.name === 'ValidationError')) throw err
			throw new HttpError(500, 'Database operation failed', {
				cause: err,
				code: errorCodes.DATABASE_ERROR,
			})
		}
	}

	async findManyWithSearchOptions(reqQuery, fieldsConfiguration, projection = null, populateFields = []) {
		try {
			let query = this.model.find({}, projection)

			query = FiltersHelper.applyFiltersOptionsFromQuery(reqQuery, fieldsConfiguration, query)

			const count = await this.model.countDocuments(query)
			query = FiltersHelper.applyActionsOptionsFromQuery(reqQuery, fieldsConfiguration, query)
			this.addPopulationOptions(query, populateFields)
			const documents = await query.lean().exec()

			return { documents, count }
		} catch (err) {
			if (err instanceof HttpError) throw err
			// CastError might occur if filters contain invalid ids etc.
			if (err && (err.name === 'CastError' || err.name === 'ValidationError')) throw err
			throw new HttpError(500, 'Failed to fetch documents', {
				cause: err,
				code: errorCodes.DATABASE_ERROR,
			})
		}
	}

	async getList(filters = {}, projection = null, populateFields = []) {
		try {
			let query = this.model.find(filters, projection)
			this.addPopulationOptions(query, populateFields)
			const documents = await query.exec()
			return documents.map((doc) => doc.toObject())
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err && (err.name === 'CastError' || err.name === 'ValidationError')) throw err
			throw new HttpError(500, 'Failed to get list', {
				cause: err,
				code: errorCodes.DATABASE_ERROR,
				expose: false,
			})
		}
	}
	/**
	 * Fetches a random sample of documents with optional filtering and population.
	 *
	 * @param {Object}   [options]
	 * @param {number}   [options.limit=10]            - Number of documents to sample.
	 * @param {Object}   [options.match={}]           - MongoDB filter to apply before sampling.
	 * @param {Array<Object>} [options.populateFields]
	 *     - Array of population specs, each object must have:
	 *       @param {string} from          - The target collection name (e.g. 'users').
	 *       @param {string} localField    - Local field in the aggregation input (e.g. 'author').
	 *       @param {string} [foreignField='_id']
	 *                                   - Field in the foreign collection to match.
	 *       @param {string} as            - Alias for the populated field in the result.
	 *
	 * @returns {Promise<Array<Document>>}
	 *     - A promise resolving to an array of hydrated Mongoose documents.
	 *
	 * @throws {HttpError}
	 *     - 400 if invalid parameters (e.g. non-integer `limit`).
	 *     - 500 on any other database or aggregation error.
	 */
	async getRandomList({ limit = 10, match = {}, populateFields = [] } = {}) {
		if (!Number.isInteger(limit) || limit <= 0) {
			throw new HttpError(400, '`Limit` must be a positive integer', {
				code: errorCodes.BAD_REQUEST,
				expose: true,
			})
		}
		try {
			const pipeline = [{ $match: match }, { $sample: { size: limit } }]

			populateFields.forEach((field) => {
				const { from, localField, foreignField, as } = field

				pipeline.push({
					$lookup: { from, localField, foreignField, as },
				})

				if (as) {
					pipeline.push({
						$unwind: {
							path: `$${as}`,
							preserveNullAndEmptyArrays: true,
						},
					})
				}
			})

			const documents = await this.model.aggregate(pipeline).exec()

			return documents
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err && (err.name === 'CastError' || err.name === 'ValidationError')) throw err
			throw new HttpError(500, 'Failed to get random list', { cause: err, code: errorCodes.DATABASE_ERROR })
		}
	}

	async create(data) {
		try {
			const newItem = new this.model(data)
			return await newItem.save()
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err && (err.code === 11000 || err.code === 11001 || err.name === 'ValidationError')) throw err
			throw new HttpError(500, 'Failed to create document', { cause: err, code: errorCodes.DATABASE_ERROR })
		}
	}

	async getById(id, projection = null, populateFields = []) {
		try {
			let query = this.model.findById(id, projection)
			populateFields.forEach((field) => {
				query = query.populate(field)
			})
			const document = await query.lean().exec()

			return document
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err && err.name === 'CastError') throw err
			throw new HttpError(500, `Failed to get document with id:${id}`, {
				cause: err,
				code: errorCodes.DATABASE_ERROR,
			})
		}
	}

	async findOne(filters = {}, projection = null, populateFields = []) {
		try {
			let query = this.model.findOne(filters, projection)
			populateFields.forEach((field) => {
				if (typeof field === 'string') {
					query = query.populate(field)
				} else if (
					typeof field === 'object' &&
					field.fieldForPopulation &&
					field.requiredFieldsFromTargetObject
				) {
					query = query.populate(field.fieldForPopulation, field.requiredFieldsFromTargetObject)
				}
			})
			filters
			const document = await query.exec()
			return document
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err && err.name === 'CastError') throw err
			throw new HttpError(500, 'Failed to get document', {
				cause: err,
				code: errorCodes.DATABASE_ERROR,
			})
		}
	}

	async update(id, data) {
		try {
			const updated = await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec()
			return updated
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (
				err &&
				(err.code === 11000 ||
					err.code === 11001 ||
					err.name === 'ValidationError' ||
					err.name === 'CastError')
			)
				throw err
			throw new HttpError(500, 'Failed to update document', { cause: err, code: errorCodes.DATABASE_ERROR })
		}
	}

	async deleteById(id) {
		try {
			const deleted = await this.model.findByIdAndDelete(id).exec()
			if (!deleted) {
				throw new HttpError(404, `Document with id:${id} not found`, {
					code: errorCodes.NOT_FOUND,
					expose: true,
				})
			}
			return deleted
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err && err.name === 'CastError') throw err
			throw new HttpError(500, `Failed to delete document with id:${id}`, {
				cause: err,
				code: errorCodes.DATABASE_ERROR,
			})
		}
	}

	addPopulationOptions(query, populateFields) {
		populateFields.forEach((field) => {
			if (typeof field === 'string') {
				query = query.populate(field)
			} else if (typeof field === 'object' && field.fieldForPopulation) {
				if (typeof field.fieldForPopulation === 'object') query = query.populate(field.fieldForPopulation)
				else query = query.populate(field.fieldForPopulation, field.requiredFieldsFromTargetObject)
			}
		})
	}
}

export default MongooseCRUDManager
