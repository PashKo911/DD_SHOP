<template>
	<div class="relative">
		<Search
			class="fill-primary absolute start-3 top-1/2 z-1 -mt-2 leading-none"
		/>
		<InputText
			:placeholder="$t('placeholders.search')"
			type="search"
			pt:root="ps-10"
			fluid
			:aria-label="$t('accessibility.searchInput')"
		/>
	</div>
</template>

<script setup>
import Search from '../icons/SearchIcon.vue'
import InputText from '@/volt/InputText.vue'
</script>
