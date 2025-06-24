// src/helpers/suggestionsHelper.js

/**
 * Groups an array of suggestion objects by gender label (in the given locale)
 * and formats them into a structure suitable for UI dropdowns or menus.
 *
 * Example output:
 * [
 *   {
 *     label: 'Male:',
 *     items: [
 *       { label: 'John Doe', genderId: 'm1', genderName: 'Male' },
 *       // …
 *     ]
 *   },
 *   {
 *     label: 'Female:',
 *     items: [
 *       { label: 'Jane Smith', genderId: 'f1', genderName: 'Female' },
 *       // …
 *     ]
 *   }
 * ]
 *
 * @param {Array<Object>} suggestions
 *   — list of suggestion objects, each with:
 *     • title: string
 *     • gender: {
 *         _id: string,
 *         label: { [locale: string]: string }
 *       }
 * @param {string} locale
 *   — the current locale code (e.g. 'en', 'uk')
 * @returns {Array<{
 *   label: string,
 *   items: Array<{
 *     label: string,
 *     genderId: string,
 *     genderName: string
 *   }>
 * }>}
 */

const buildSuggestionGroups = (suggestions, locale) => {
	const grouped = suggestions.reduce((acc, s) => {
		const genderLabel = s.gender.label[locale] ?? s.gender.label.en ?? 'unknown'
		const key = `${genderLabel}:`
		if (!acc[key]) acc[key] = []

		acc[key].push(s)
		return acc
	}, {})

	return Object.entries(grouped).map(([label, arr]) => ({
		label,
		items: arr.map((i) => ({
			label: i.title,
			genderId: i.gender._id,
			genderName: i.gender.label.en,
		})),
	}))
}

export default buildSuggestionGroups
