<template>
	<button
		type="button"
		aria-label=" open / close menu"
		class="relative h-11 w-11 md:hidden"
	>
		<span
			:class="topSpanClass"
			class="bg-inverse absolute top-2.5 right-[0.44rem] h-1 w-[1.875rem] rounded transition-transform duration-200"
		></span>
		<span
			:class="middleSpanClass"
			class="bg-inverse absolute right-[0.44rem] h-1 w-[1.875rem] translate-y-[-.125rem] rounded-[0.1875rem] transition-all duration-200"
		></span>
		<span
			:class="bottomSpanClass"
			class="bg-inverse absolute right-[0.44rem] bottom-2.5 h-1 w-[1.875rem] rounded transition-transform duration-200"
		></span>
	</button>
</template>

<script setup>
import { computed } from 'vue'
import { useMediaQuery } from '@/composables/useMediaQuery'

const props = defineProps({
	isHeaderMenuOpen: {
		type: Boolean,
		default: false,
	},
})

const isMobile = useMediaQuery('(max-width: 767.98px)')

const topSpanClass = computed(() => {
	return isMobile.value && props.isHeaderMenuOpen
		? `rotate-45 translate-y-[.625rem]`
		: ''
})
const middleSpanClass = computed(() => {
	return isMobile.value && props.isHeaderMenuOpen ? `opacity-0` : ''
})
const bottomSpanClass = computed(() => {
	return isMobile.value && props.isHeaderMenuOpen
		? `-rotate-45 -translate-y-[.625rem]`
		: ''
})
</script>
