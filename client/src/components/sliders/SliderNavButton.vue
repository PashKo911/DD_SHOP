<template>
	<button
		class="btn-prev focus-visible:outline-primary z-[1] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full outline outline-transparent transition-all duration-300 hover:shadow-lg"
	>
		<slot>
			<arrow-left-icon />
		</slot>
	</button>
</template>

<script setup>
import ArrowLeftIcon from '../icons/ArrowLeftIcon.vue'
</script>
