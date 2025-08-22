import FiltersHelper from '../../../utils/searchHelpers/FiltersHelper.mjs'
import { HttpError } from '../../../errors/HttpError.mjs'

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
			if (!document) {
				throw new HttpError(404, 'Document not found')
			}
			return document
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err.name === 'CastError') {
				throw new HttpError(400, 'Invalid query parameters', err)
			}
			throw new HttpError(500, 'Error retrieving data', err)
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
			if (err.name === 'CastError') {
				throw new HttpError(400, 'Invalid filters or pagination parameters', err)
			}
			throw new HttpError(500, 'Failed to fetch documents', err)
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
			throw new HttpError(500, 'Error retrieving data', err)
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
		try {
			const pipeline = [{ $match: match }, { $sample: { size: limit } }]

			populateFields.forEach((field) => {
				const { from, localField, foreignField, as } = field

				pipeline.push({
					$lookup: { from, localField, foreignField, as },
				})
				pipeline.push({ $unwind: `$${as}` })
			})

			const documents = await this.model.aggregate(pipeline).exec()

			return documents
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err.name === 'CastError') {
				throw new HttpError(400, 'Invalid query parameters', err)
			}
			throw new HttpError(500, 'Error retrieving data', err)
		}
	}

	async create(data) {
		try {
			const newItem = new this.model(data)
			return await newItem.save()
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err.name === 'ValidationError') {
				throw new HttpError(400, 'Validation failed', err)
			}
			if (err.name === 'MongoServerError' && err.code === 11000) {
				throw new HttpError(409, 'Duplicate key error', err)
			}
			throw new HttpError(500, 'Error creating data')
		}
	}

	async getById(id, projection = null, populateFields = []) {
		try {
			let query = this.model.findById(id, projection)
			populateFields.forEach((field) => {
				query = query.populate(field)
			})
			const document = await query.lean().exec()
			if (!document) {
				throw new HttpError(404, `Document with id=${id} not found`)
			}
			return document
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err.name === 'CastError') {
				throw new HttpError(400, `Invalid id format id:${id}`)
			}
			throw new HttpError(500, 'Error finding data by id', err)
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
			const document = await query.exec()
			if (!document) {
				throw new HttpError(404, 'Document not found')
			}
			return document
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err.name === 'CastError') {
				throw new HttpError(400, 'Invalid filter parameters', err)
			}
			throw new HttpError(500, 'Error finding document', err)
		}
	}

	async update(id, data) {
		try {
			const updated = await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec()
			if (!updated) {
				throw new HttpError(404, `Document with id:${id} not found`)
			}
			return updated
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err.name === 'ValidationError' || err.name === 'CastError') {
				throw new HttpError(400, 'Invalid update data or id format', err)
			}
			if (err.name === 'MongoServerError' && err.code === 11000) {
				throw new HttpError(409, 'Duplicate key error on update', err)
			}
			throw new HttpError(500, 'Error updating data', err)
		}
	}

	async deleteById(id) {
		try {
			const deleted = await this.model.findByIdAndDelete(id).exec()
			if (!deleted) {
				throw new HttpError(404, `Document with id:${id} not found`)
			}
			return deleted
		} catch (err) {
			if (err instanceof HttpError) throw err
			if (err.name === 'CastError') {
				throw new HttpError(400, `Invalid id format: ${id}`, err)
			}
			throw new HttpError(500, 'Error deleting data')
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
