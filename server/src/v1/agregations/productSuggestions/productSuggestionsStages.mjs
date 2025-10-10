export const projectTitle = (titlePath) => ({
	$project: {
		_id: 0,
		title: titlePath,
		gender: 1,
	},
})

export const lookupGenders = {
	$lookup: {
		from: 'genders',
		localField: 'gender',
		foreignField: '_id',
		as: 'gender',
	},
}

export const unwindGender = { $unwind: '$gender' }

export const projectForGrouping = {
	$project: {
		title: 1,
		genderId: '$gender._id',
		genderName: '$gender.label.en',
		label: '$title',
	},
}

export const groupByGender = {
	$group: {
		_id: '$genderId',
		label: { $first: '$genderName' },
		items: {
			$push: {
				genderId: '$genderId',
				genderName: '$genderName',
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
	lookupGenders,
	unwindGender,
	projectForGrouping,
	groupByGender,
	projectSlice(sliceLimit),
]
