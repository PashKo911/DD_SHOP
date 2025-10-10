import { toObjectId } from '../../../../utils/toObjectId.mjs'

export function cartProductFilter(customer, productId, variant, size) {
	return {
		customer: customer,
		'productsList.product': productId,
		'productsList.variant': variant,
		'productsList.size': size,
	}
}

export function productsFilter(productId, variant, size) {
	return {
		arrayFilters: [
			{
				'elem.product': productId,
				'elem.variant': variant,
				'elem.size': size,
			},
		],
	}
}
export function updateSet(amount) {
	return {
		$set: { 'productsList.$[elem].amount': amount },
	}
}

export function updateInc(amount) {
	return {
		$inc: { 'productsList.$[elem].amount': amount },
	}
}

export function pushUpdate(product, variant, size, amount) {
	return {
		$push: {
			productsList: {
				product,
				variant,
				size,
				amount,
			},
		},
	}
}
export function pullUpdate(product, variant, size) {
	return {
		$pull: {
			productsList: {
				product: toObjectId(product),
				variant: toObjectId(variant),
				size: toObjectId(size),
			},
		},
	}
}
