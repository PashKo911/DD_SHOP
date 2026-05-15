<template>
	<div
		:role="multiple ? 'group' : 'radiogroup'"
		:aria-label="ariaLabel"
		:aria-multiselectable="multiple ? 'true' : undefined"
		:class="groupClass"
	>
		<label
			v-for="(item, idx) in items"
			:key="item._id ?? item.value"
			:role="props.multiple ? 'checkbox' : 'radio'"
			ref="labels"
			:class="labelClass"
			:aria-checked="modelValue === item._id"
			:aria-label="item.label"
			tabindex="0"
			@keydown.space.prevent="onToggleOrSelect(item._id, idx)"
			@keydown.enter.prevent="onToggleOrSelect(item._id, idx)"
			@keydown.arrow-right.prevent="moveFocus(1)"
			@keydown.arrow-down.prevent="moveFocus(1)"
			@keydown.arrow-left.prevent="moveFocus(-1)"
			@keydown.arrow-up.prevent="moveFocus(-1)"
			@focus="focusIndex = idx"
		>
			<input
				:type="multiple ? 'checkbox' : 'radio'"
				:value="item._id"
				:id="uuidv4()"
				tabindex="-1"
				v-model="model"
				@input="onInput"
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
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
	items: Array,
	multiple: {
		type: Boolean,
		default: false,
	},
	ariaLabel: { type: String, default: 'Radio group' },
	groupClass: { type: String, default: 'flex gap-2' },
	labelClass: { type: String, default: '' },
	spanClass: { type: String, default: '' },
})

const model = defineModel()
const emit = defineEmits(['input'])
//========================================================================================================================================================

const labels = ref([])
const focusIndex = ref(0)

//========================================================================================================================================================

function toggle(value, idx) {
	const current = Array.isArray(model.value) ? model.value : []
	let next
	if (current.includes(value)) {
		next = current.filter((v) => v !== value)
	} else {
		next = [...current, value]
	}
	emit('update:modelValue', next)
	focusIndex.value = idx
	labels.value[idx]?.focus()
}

function onToggleOrSelect(value, idx) {
	if (props.multiple) {
		toggle(value, idx)
	} else {
		select(value, idx)
	}
}

const onInput = (e) => {
	emit('input', e)
}

const select = (value, idx) => {
	model.value = value

	emit('input', {
		target: { value },
	})
	focusIndex.value = idx
	labels.value[idx]?.focus()
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
