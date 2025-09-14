<template>
	<div class="relative">
		<div class="absolute start-4 top-1/2 z-1 -translate-y-1/2">
			<slot name="icon">
				<mail-icon class="fill-surface-300" />
			</slot>
		</div>

		<slot name="input">
			<input-text v-model="model" />
		</slot>
	</div>
</template>

<script setup>
import MailIcon from '../icons/MailIcon.vue'
import InputText from '../ui/InputText.vue'

const model = defineModel()
</script>
