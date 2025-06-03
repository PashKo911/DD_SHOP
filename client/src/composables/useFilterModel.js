import { computed } from 'vue'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'

export function useFilterModel(prop) {
	const filterStore = useFilterStore()
	const { setFilterProp } = filterStore
	const { filter } = storeToRefs(filterStore)

	return computed({
		get() {
			return filter.value[prop]
		},
		set(newVal) {
			setFilterProp(prop, newVal)
			setFilterProp('page', 0)
		},
	})
}
