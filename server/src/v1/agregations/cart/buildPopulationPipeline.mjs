import { formatStages } from './populationStages.mjs'
import { toObjectId } from '../../../../utils/toObjectId.mjs'

export function buildPopulationPipeline(cartData, userId, language, rate) {
	if (!Array.isArray(cartData) || cartData.length === 0) return null

	const cartDataWithObjIds = cartData.map((p) => ({
		...p,
		product: toObjectId(p.product),
		variant: toObjectId(p.variant),
		size: toObjectId(p.size),
	}))

	if (!userId) {
		const res = [
			{ $limit: 1 },
			{ $replaceRoot: { newRoot: { productsList: cartDataWithObjIds || [] } } },
			...formatStages(language, rate),
		]
		return res
	}
	const userObjId = toObjectId(userId)
	const res = [
		{ $match: { customer: userObjId } },
		{ $project: { productsList: 1, _id: 0 } },
		...formatStages(language, rate),
	]
	return res
}
