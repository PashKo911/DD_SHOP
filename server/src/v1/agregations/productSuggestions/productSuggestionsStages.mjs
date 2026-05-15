export const projectTitle = (titlePath) => ({
	$project: {
		_id: 0,
		title: titlePath,
		category: 1,
	},
})

export const lookupCategories = {
	$lookup: {
		from: 'categories',
		localField: 'category',
		foreignField: '_id',
		as: 'category',
	},
}

export const unwindCategory = { $unwind: '$category' }

export const projectForGrouping = {
	$project: {
		title: 1,
		categoryId: '$category._id',
		categoryName: '$category.label.en',
		label: '$title',
	},
}

export const groupByCategory = {
	$group: {
		_id: '$categoryId',
		label: { $first: '$categoryName' },
		items: {
			$push: {
				categoryId: '$categoryId',
				categoryName: '$categoryName',
				label: '$title',
			},
		},
	},
}

export const projectSlice = (sliceLimit) => ({
	$project: {
		label: 1,
		items: { $slice: ['$items', sliceLimit] },
	},
})

export const formatStages = (titlePath, sliceLimit) => [
	projectTitle(titlePath),
	lookupCategories,
	unwindCategory,
	projectForGrouping,
	groupByCategory,
	projectSlice(sliceLimit),
]
