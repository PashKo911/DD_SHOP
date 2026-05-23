<template>
	<div
		id="backdrop"
		role="presentation"
		aria-hidden="true"
		:data-body-locked="isBodyLocked"
		class="invisible fixed inset-0 z-[1000] opacity-0 transition-opacity duration-300"
		:class="[
			backgroundClass,
			{
				'visible opacity-100': visible,
			},
		]"
		@click="$emit('backdropClick')"
	></div>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
	visible: {
		type: Boolean,
		default: false,
	},
	bodyScrollLocked: {
		type: Boolean,
		default: false,
	},
	backgroundClass: {
		type: String,
		default: 'bg-black/50',
	},
})
//========================================================================================================================================================

const emits = defineEmits(['backdropClick'])
//========================================================================================================================================================
const isBodyLocked = computed(() => {
	return props.bodyScrollLocked && props.visible
})

//========================================================================================================================================================
const onKeydown = (e) => {
	if (e.key === 'Escape') emits('backdropClick')
}

//========================================================================================================================================================

onMounted(() => {
	window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
	window.removeEventListener('keydown', onKeydown)
})
</script>
