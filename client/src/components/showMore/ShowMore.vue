<template>
	<div class="show-more">
		<div
			class="mb-1 overflow-hidden transition-[max-height] duration-300"
			:style="{
				maxHeight: isOpen
					? computedHeight + 'px'
					: props.collapsedHeight + 'px',
			}"
			ref="contentRef"
		>
			<slot />
		</div>
		<slot name="button">
			<Button
				:label="t(activeShowMoreButtonName)"
				variant="text"
				contrast
				size="small"
				v-if="isButtonVisible"
				:aria-expanded="isOpen.toString()"
				@click="isOpen = !isOpen"
				@keydown.escape.prevent="isOpen = false"
				class="text-t-hover w-max"
			/>
		</slot>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from '../ui/buttons/Button.vue'

const { t } = useI18n()

const props = defineProps({
	collapsedHeight: {
		type: Number,
		default: 100,
	},
})

const isOpen = ref(false)
const contentRef = ref(null)
const rawHeight = ref(0)

let ro

onMounted(() => {
	ro = new ResizeObserver(() => {
		rawHeight.value = contentRef.value?.scrollHeight ?? 0
	})
	ro.observe(contentRef.value)
})
onBeforeUnmount(() => {
	ro.disconnect()
})

const computedHeight = computed(() => rawHeight.value)

const isButtonVisible = computed(
	() => computedHeight.value > props.collapsedHeight,
)
const activeShowMoreButtonName = computed(() => {
	return isOpen.value ? 'buttons.hide' : 'buttons.showMore'
})
</script>
