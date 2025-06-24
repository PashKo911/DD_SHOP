<template>
	<div class="relative">
		<div class="absolute start-4 top-1/2 z-1 -translate-y-1/2">
			<slot name="icon">
				<search-icon class="fill-surface-300 leading-none" />
			</slot>
		</div>

		<slot name="input">
			<InputText
				:tabindex="1"
				:placeholder="t('placeholders.search')"
				pt:root="rounded-md"
				v-model="model"
				size="small"
				icon-field
				fluid
				:aria-label="t('accessibility.searchInput')"
			/>
		</slot>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import SearchIcon from '../icons/SearchIcon.vue'
import InputText from '../ui/inputText/InputText.vue'

const { t } = useI18n()

const model = defineModel()
</script>
