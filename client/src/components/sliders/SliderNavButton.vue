<template>
	<button
		class="btn-prev group focus-visible:outline-primary disabled:fill-dark-grey z-[1] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg outline outline-transparent transition-all duration-300 hover:shadow-md disabled:pointer-events-none disabled:shadow-sm disabled:select-none"
	>
		<slot>
			<arrow-left-icon class="aspect-square" />
		</slot>
	</button>
</template>

<script setup>
import ArrowLeftIcon from '../icons/ArrowLeftIcon.vue'
</script>
