<template>
	<div
		:aria-label="ariaLabel"
		:aria-readonly="props.readonly.toString()"
		:tabindex="props.readonly ? -1 : 0"
		role="radiogroup"
		class="focus-visible:outline-primary inline-flex h-4 items-start gap-[.3125rem] rounded-sm outline outline-transparent transition-colors"
	>
		<label
			v-for="index in stars"
			ref="starsLabelsRefs"
			role="radio"
			:key="index"
			:aria-checked="(model === index).toString()"
			:tabindex="props.readonly ? -1 : 0"
			@keydown.arrow-right.prevent="moveFocus(1)"
			@keydown.arrow-left.prevent="moveFocus(-1)"
			@keydown.enter.prevent="selectStar(index)"
			@keydown.space.prevent="selectStar(index)"
			@focus="focusIndex = index"
			class="star focus-visible:outline-primary relative h-4 w-4 rounded-sm bg-contain bg-no-repeat outline outline-transparent transition-colors"
			:class="{
				'cursor-pointer': !props.readonly,
				'cursor-default': props.readonly,
			}"
		>
			<input
				type="radio"
				:value="index"
				:disabled="props.readonly"
				v-model="model"
				tabindex="-1"
				class="absolute inset-0 h-full w-full opacity-0"
				:class="{
					'cursor-pointer': !props.readonly,
					'cursor-default': props.readonly,
				}"
			/>
			<span
				class="star-filled absolute top-0 left-0 h-full bg-contain bg-no-repeat"
				:style="`width: ${getStarWidth(index)}`"
			></span>
		</label>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const model = defineModel({ default: () => 0 })

const props = defineProps({
	stars: { type: Number, default: 5 },
	readonly: { type: Boolean, default: false },
	ariaLabel: { type: String, default: 'Rating' },
})

const starsLabelsRefs = ref([])
const focusIndex = ref(0)

const getStarWidth = (index) => {
	const fullStars = Math.floor(model.value)
	const partialStar = model.value - fullStars

	if (index - 1 < fullStars) {
		return '100%'
	}
	if (index - 1 === fullStars && partialStar > 0) {
		return `${partialStar * 100}%`
	}
	return '0%'
}

function selectStar(value) {
	if (props.readonly) return

	model.value = value
	focusIndex.value = value

	starsLabelsRefs.value[focusIndex.value - 1]?.focus()
}

function moveFocus(delta) {
	if (props.readonly) return
	const total = props.stars
	let next = focusIndex.value + delta

	if (next < 1) next = total
	if (next > total) next = 1

	focusIndex.value = next
	starsLabelsRefs.value[focusIndex.value - 1]?.focus()
}
</script>

<style scoped>
.star {
	background: url('./icons/star.svg') 0 0 / 1rem no-repeat;
}
.star-filled {
	background: url('./icons/star-filled.svg') 0 0 / 1rem no-repeat;
}
</style>
