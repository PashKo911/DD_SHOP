import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'

export function useFilterModel(prop) {
	const router = useRouter()
	const route = useRoute()
	const filterStore = useFilterStore()
	const { setFilterProp } = filterStore
	const { filter, filterStrings } = storeToRefs(filterStore)

	return computed({
		get() {
			return filter.value[prop]
		},
		set(newVal) {
			setFilterProp(prop, newVal)
			router.replace({
				name: route.name,
				query: filterStrings.value,
				params: { ...route.params },
			})
		},
	})
}
