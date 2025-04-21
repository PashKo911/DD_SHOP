<template>
	<div class="relative">
		<div class="absolute start-4 top-1/2 z-1 -translate-y-1/2">
			<slot name="icon">
				<Search class="fill-surface-300 leading-none" />
			</slot>
		</div>

		<slot name="input">
			<InputText
				:placeholder="$t('placeholders.search')"
				type="iconField"
				pt:root="rounded-[1.0625rem]"
				size="small"
				fluid
				:aria-label="$t('accessibility.searchInput')"
			/>
		</slot>
	</div>
</template>

<script setup>
import Search from '../icons/SearchIcon.vue'
import InputText from '@/volt/InputText.vue'
</script>
