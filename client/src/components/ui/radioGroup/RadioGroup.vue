<template>
	<div
		:role="multiple ? 'group' : 'radiogroup'"
		:aria-label="ariaLabel"
		:class="groupClass"
	>
		<label
			v-for="(item, idx) in items"
			:key="item._id ?? item.value"
			role="radio"
			tabindex="0"
			ref="labels"
			:class="labelClass"
			:aria-checked="modelValue === item._id"
			:aria-label="item.label"
			@keydown.space.prevent="onToggleOrSelect(item._id, idx)"
			@keydown.enter.prevent="onToggleOrSelect(item._id, idx)"
			@keydown.arrow-right.prevent="moveFocus(1)"
			@keydown.arrow-left.prevent="moveFocus(-1)"
			@focus="focusIndex = idx"
		>
			<input
				:type="multiple ? 'checkbox' : 'radio'"
				tabindex="-1"
				:value="item._id"
				@input="onInput"
				v-model="model"
				class="peer sr-only"
			/>
			<slot name="item" :item="item" :checked="getCheckedItem(item)">
				<span :class="spanClass">{{ item.label }}</span>
			</slot>
		</label>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
	items: Array,
	multiple: { type: Boolean, default: false },
	ariaLabel: { type: String, default: 'Radio group' },
	groupClass: { type: String, default: 'flex gap-2' },
	labelClass: { type: String, default: '' },
	spanClass: { type: String, default: '' },
})

const model = defineModel()
const emit = defineEmits(['input'])

const labels = ref([])
const focusIndex = ref(0)

function onToggleOrSelect(value, idx) {
	if (props.multiple) {
		toggle(value, idx)
	} else {
		select(value, idx)
	}
}

function toggle(value, idx) {
	const arr = model.value
	const pos = arr.indexOf(value)
	if (pos === -1) arr.push(value)
	else arr.splice(pos, 1)
	focusIndex.value = idx
	labels.value[idx]?.focus()
}

const select = (value, idx) => {
	model.value = value

	emit('input', {
		target: { value },
	})
	focusIndex.value = idx
	labels.value[idx]?.focus()
}

const onInput = (e) => {
	model.value = e.target.value
	emit('input', e)
}

const moveFocus = (delta) => {
	const n = props.items.length
	let next = (focusIndex.value + delta + n) % n
	focusIndex.value = next
	labels.value[next]?.focus()
}

const getCheckedItem = (item) => {
	if (!props.multiple) {
		return item._id === model.value
	}

	if (!Array.isArray(model.value)) {
		return false
	}

	return model.value?.includes(item._id)
}
</script>
