export const unwindProductsList = { $unwind: { path: '$productsList', preserveNullAndEmptyArrays: true } }

export const replaceRoot = { $replaceRoot: { newRoot: '$productsList' } }

export const lookupProduct = {
	$lookup: {
		from: 'products',
		let: { prodId: '$product' },
		pipeline: [
			{ $match: { $expr: { $eq: ['$_id', '$$prodId'] } } },
			{
				$project: {
					title: 1,
					categoryKey: 1,
					'variants._id': 1,
					'variants.price': 1,
					'variants.oldPrice': 1,
					'variants.images': 1,
					'variants.color': 1,
					'variants.sizes': 1,
				},
			},
		],
		as: 'product',
	},
}

export const unwindProduct = { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } }

export const addVariant = {
	$addFields: {
		variant: {
			$arrayElemAt: [
				{
					$filter: {
						input: '$product.variants',
						as: 'v',
						cond: { $eq: ['$$v._id', '$variant'] },
					},
				},
				0,
			],
		},
	},
}

export const lookupSize = {
	$lookup: {
		from: 'sizes',
		localField: 'size',
		foreignField: '_id',
		as: 'size',
	},
}

export const unwindSize = { $unwind: { path: '$size', preserveNullAndEmptyArrays: true } }

export const lookupColor = {
	$lookup: {
		from: 'colors',
		localField: 'variant.color',
		foreignField: '_id',
		as: 'color',
	},
}

export const unwindColor = { $unwind: { path: '$color', preserveNullAndEmptyArrays: true } }

export const finalProductProject = (language, rate) => {
	const rateStr = String(rate)

	return {
		$project: {
			_id: '$_id',
			productId: '$product._id',
			variant: '$variant._id',
			title: `$product.title.${language}`,

			color: {
				_id: '$color._id',
				label: `$color.label.${language}`,
				value: '$color.value',
				slug: '$color.slug',
			},
			totalPrice: {
				$toDouble: {
					$round: [{ $multiply: ['$variant.price', '$amount', { $toDecimal: rateStr }] }, 2],
				},
			},
			totalOldPrice: {
				$toDouble: {
					$round: [
						{ $multiply: [{ $ifNull: ['$variant.oldPrice', 0] }, '$amount', { $toDecimal: rateStr }] },
						2,
					],
				},
			},
			categoryKey: '$product.categoryKey',
			size: 1,
			image: { $arrayElemAt: ['$variant.images', 0] },
			amount: 1,
		},
	}
}

export const groupProducts = {
	$group: {
		_id: null,
		productsList: { $push: '$$ROOT' },
		total: { $sum: '$totalPrice' },
		totalDiscount: { $sum: { $subtract: ['$totalOldPrice', '$totalPrice'] } },
		totalWithoutDiscount: { $sum: '$totalOldPrice' },
	},
}

export const finalProject = {
	$project: {
		_id: 0,
		productsList: 1,
		total: { $toDouble: '$total' },
		totalDiscount: { $toDouble: '$totalDiscount' },
		totalWithoutDiscount: { $toDouble: '$totalWithoutDiscount' },
	},
}

export const formatStages = (language, rate) => {
	return [
		unwindProductsList,
		replaceRoot,
		lookupProduct,
		unwindProduct,
		addVariant,
		lookupSize,
		unwindSize,
		lookupColor,
		unwindColor,
		finalProductProject(language, rate),
		groupProducts,
		finalProject,
	]
}
