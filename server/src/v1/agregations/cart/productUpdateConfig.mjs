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
export function updateSet(quantity) {
	return {
		$set: { 'productsList.$[elem].quantity': quantity },
	}
}

export function updateInc(quantity) {
	return {
		$inc: { 'productsList.$[elem].quantity': quantity },
	}
}

export function pushUpdate(product, variant, size, quantity) {
	return {
		$push: {
			productsList: {
				product,
				variant,
				size,
				quantity,
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
